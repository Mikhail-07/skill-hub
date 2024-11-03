const uuid = require('uuid')
const path = require('path')
const fs = require('fs');
const { unlink } = require('node:fs/promises');
const {Course, Lesson, User, OrderCourse} = require('../models/models')
const ApiError = require('../error/ApiError');

const courseFilling = async (title, subTitle, description, price, lessons, img, files) => {
  const fileName = uuid.v4() + '.jpg';
  img.mv(path.resolve(__dirname, '..', 'static', fileName));
  const course = await Course.create({title, subTitle, description, price, img: fileName});
  JSON.parse(lessons).forEach(async lesson => {
    const {number, title, description, content} = lesson
    
    let fileName = null;
    if (files[`lesson_${lesson.number}`]){
      const audio = files[`lesson_${lesson.number}`]
      console.log(audio)
      fileName = uuid.v4() + '.mp3';
      audio.mv(path.resolve(__dirname, '..', 'static', fileName));
    }
    
    await Lesson.create({number, title, description, content, audio: fileName, courseId: course.id})
  });

  return course
}

class CourseController{
  async create(req, res, next){
    try {
      const {title, subTitle, description, price, lessons} = req.body;
      const {img} = req.files;
      const course = courseFilling(title, subTitle, description, price, lessons, img, req.files)
      console.log('[[[[[[[[[[[[[xxxxx')
      console.log(typeof lessons)
      console.log('[[[[[[[[[[[[[xxxx')
      return res.json(course)
    } catch(e) {
      next(new Error('Something broke again! '))
      next(ApiError.badRequest(e.message))
    } 
  }

  async edit(req, res, next){
    try {
      const {id, title, subTitle, description, price, lessons} = req.body;

      if (req.files && req.files.img){
        const {img} = req.files
        const existingCourse = await Course.findOne({where: {id}})
        const existingCourseImageName = existingCourse.img
        const filePath = path.resolve(__dirname, '..', 'static', existingCourseImageName);
        if (fs.existsSync(filePath)){
          await unlink(path.resolve(filePath));
        }

        const fileName = uuid.v4() + '.jpg';
        console.log('Картинка' + fileName + ' сохранена')
        img.mv(path.resolve(__dirname, '..', 'static', fileName));
        await Course.update({img: fileName}, {where: {id}})  
      }
      
      const course = await Course.update({title, subTitle, description, price}, {
        where: {id}
      })   

      const middle = Math.ceil(lessons.length/2)
      console.log('Уроки lessons: ', lessons)
      lessons.splice(0, middle)
      for (const lesson of JSON.parse(lessons)){
        console.log(lesson)
        const {number, title, description, content} = lesson
        const existingLesson = await Lesson.findOne({ where: {number, courseId: id}})

        let fileName = ''
        if (req.files && req.files[`lesson_${number}`]){ //проверка на наличие файла в запросе
          const filePath = path.resolve(__dirname, '..', 'static', existingLesson.audio);
          if (fs.existsSync(filePath)){
            console.log('Удален аудиоматериал у ' + number + ' урока')
            await unlink(filePath);
          }
          const audio = req.files[`lesson_${number}`]
          fileName = uuid.v4() + '.mp3';
          console.log('Аудиматериалу урока ' + number + ' присвоено новое имя: ' + fileName)
          audio.mv(path.resolve(__dirname, '..', 'static', fileName));
        } else {
          fileName = existingLesson.audio
        }

        if (existingLesson){
          console.log('Обновил урок:' + number)

          existingLesson.set({
            number, 
            title, 
            description, 
            content, 
            audio: fileName
          })
          await existingLesson.save()

        } else {
          console.log('Создал урок:' + number)
          await Lesson.create({number, title, description, content, audio: fileName, courseId: id})
        }
      };

      let i = JSON.parse(lessons).length + 1
        const lessonDelete = async () => {
          console.log(i)
          const beingDelete = await Lesson.findOne({where: {courseId: id, number: i}})
          console.log(beingDelete)
          if (beingDelete){
            await Lesson.destroy({where: {courseId: id, number: i}});
            i = i + 1;
            lessonDelete()
          } else {
            return
          }
        }
        lessonDelete()
      
      return res.json(course)
    } catch(e) {
      next(new Error('Something broke '))
      next(ApiError.badRequest(e.message))
    } 
  }

  async getAll(req, res, next){
    const courses = await Course.findAll({
      include: [{model: Lesson, attributes: ['id', 'title']}]
    })
    return res.json(courses)
  }

  async getOne(req, res){
    const {id} = req.params;
    const course = await Course.findOne({
      where: {id},
      include: [{model: Lesson, attributes: ['id', 'description', 'title', 'number']}]
    })

    return res.json(course)
  }

  async getCourseLessons(req, res, next){
    const {id} = req.params;
    console.log('-------------------')
    console.log(id)
    console.log('-------------------')
    const lessons = await Lesson.findAll({
      where: {courseId: id},
      order:[['number', 'ASC']],
      attributes: ['id', 'title', 'description', 'content', 'number', 'audio'],
    })
    return res.json(lessons)
  }

  async registrationOnCourse(req, res, next){
    const {email, courseId} = req.body;
    console.log('-------------------')
    console.log(email)
    console.log('-------------------')
    const user = await User.findOne({where: {email}})
    const course = await Course.findOne({where: {id: courseId}})
    let registration
    if (course.price === 0){
      registration = await OrderCourse.create({orderId: user.id, courseId, free: true});
    } else {
      registration = await OrderCourse.create({orderId: user.id, courseId});
    }
    return res.json(registration)
  }
}

module.exports = new CourseController