const uuid = require('uuid')
const path = require('path')
const fs = require('fs');
const { unlink } = require('node:fs/promises');
const { Course, Lesson, User, OrderCourse, Waitlist, CourseBlock } = require('../models/models')
const ApiError = require('../error/ApiError');
const { Op } = require('sequelize');
const { Console } = require('console');

const courseFilling = async (title, subTitle, price, category, firstDayBonus, additionalBlocks, lessons, img, files, mediaFiles) => {
  // Сохранение обложки курса
  const imgFileName = uuid.v4() + '.jpg';
  img.mv(path.resolve(__dirname, '..', 'static', imgFileName));

  console.log('lessons:', lessons);
  console.log('course data:', { title, subTitle, price, category, firstDayBonus });

  // Создание курса
  const course = await Course.create({
    title,
    subTitle,
    price,
    category,
    firstDayBonus,
    img: imgFileName
  });

  console.log('COURSE SAVED!');
  
  // Разбор и сохранение уроков
  const parsedLessons = JSON.parse(lessons);
  console.log('LESSONS PARSED!');
  console.log('MEDIA:', mediaFiles);

  const parsedMediaFiles = mediaFiles.map(file => JSON.parse(file));
  console.log('Parsed Media Files:', parsedMediaFiles);

  for (let lesson of parsedLessons) {
    const { number, title, description, content } = lesson;
    let fileName = null;

    // Найдём соответствующий медиафайл для урока по типу
    const media = parsedMediaFiles.find((file) => file.number === number);
    if (media) {
      const { type } = media;
      const fileKey = `lesson_${number}`;

      if (files[fileKey]) {
        const mediaFile = files[fileKey];
        fileName = uuid.v4() + (type === 'audio' ? '.mp3' : '.mp4');
        mediaFile.mv(path.resolve(__dirname, '..', 'static', fileName));
      }
    }

    // Создаём урок с привязкой к курсу
    await Lesson.create({
      number,
      title,
      description,
      content,
      audio: fileName,
      courseId: course.id
    });
  }

  // Разбор и сохранение дополнительных блоков
  console.log('ADDITIONAL BLOCKS: ', additionalBlocks)
  const parsedAdditionalBlocks = JSON.parse(additionalBlocks);
  console.log('Parsed Additional Blocks:', parsedAdditionalBlocks);

  for (let block of parsedAdditionalBlocks) {
    const { title, content } = block;

    await CourseBlock.create({
      title,
      content,
      courseId: course.id
    });
  }

  console.log('ADDITIONAL BLOCKS SAVED!');
  return course;
};

class CourseController{
  async create(req, res, next) {
    try {
      const { title, subTitle, price, category, firstDayBonus, lessons, additionalBlocks, mediaFiles } = req.body;
      const { img } = req.files;
  
      console.log("BODY: ", req.body);
      console.log("FILES: ", req.files);
  
      // Создаем курс с новыми полями
      const course = await courseFilling(title, subTitle, parseInt(price), category, firstDayBonus, additionalBlocks, lessons, img, req.files, mediaFiles);
  
      return res.json(course);
    } catch (e) {
      next(new Error('Something broke again! '));
      next(ApiError.badRequest(e.message));
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

  async getOne(req, res) {
    const { id } = req.params;

    try {
        const course = await Course.findOne({
            where: { id },
            include: [
                {
                    model: Lesson,
                    attributes: ['id', 'description', 'title', 'number'],
                },
                {
                    model: CourseBlock,
                    attributes: ['id', 'title', 'content'],
                    as: 'additionalBlocks', // Переименовываем в additionalBlocks
                },
            ],
        });

        if (course && course.lessons) {
          course.lessons = course.lessons.map(lesson => {
            if (lesson.description) {
              lesson.description = lesson.description.split('\n').map(item => item.trim()).filter(item => item !== '');
            }
            return lesson;
          });
        }

        if (!course) {
            return res.status(404).json({ message: 'Курс не найден' });
        }

        return res.json(course); // Теперь будет include с правильным именем additionalBlocks
    } catch (error) {
        console.error('Error fetching course:', error);
        return res.status(500).json({ message: 'Ошибка сервера' });
    }
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

  async addToWaitlist({ chatId, name, surname, email, courseId }) {
    try {
      // Проверяем, есть ли пользователь с такими данными
      let user = await User.findOne({
          where: {
              name: { [Op.iLike]: name },
              surname: { [Op.iLike]: surname },
              chatId
          }
      });

      // Если пользователь не найден, создаем его
      if (!user) {
          user = await User.create({ chatId, name, surname, email });
      }

      // Проверяем, есть ли уже запись в Waitlist для данного пользователя и курса
      const existingWaitlistEntry = await Waitlist.findOne({
          where: {
              userId: user.id,
              courseId
          }
      });

      if (existingWaitlistEntry) {
          return { message: 'Вы уже зарегистрированы на курс.' };
      }

      // Добавляем запись в Waitlist
      await Waitlist.create({
          userId: user.id,
          courseId
      });

      return {
          message: 'Спасибо! Мы добавили вас в список предзаписи на курс. Вам придет письмо на почту! 😊\n\nЕсли письмо не пришло или есть вопросы, пишите в саппорт.'
      };
    } catch (error) {
        console.error(error);
        return { message: 'Ошибка сервера. Попробуйте позже или обратитесь в поддержку.' };
    }
  }
}

module.exports = new CourseController