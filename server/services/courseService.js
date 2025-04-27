// services/courseService.js

const { Course, Lesson, Service, Offer } = require("../models/models")

class CourseService {
  async getAllOffers() {
    const courses = await Course.findAll({
      include: [{ model: Lesson, attributes: ["id", "title"] }],
    })

    const services = await Service.findAll()

    const courseOffers = courses.map((course) => ({
      id: course.id,
      type: "course",
      title: course.title,
      subTitle: course.subTitle,
      description: course.description,
      img: course.img,
      price: course.price,
      category: course.category,
      lessons: course.lessons || [],
    }))

    const serviceOffers = services.map((service) => ({
      id: service.id,
      type: "service",
      name: service.name,
      description: service.description,
      price: service.price,
      img: service.img,
      serviceType: service.type,
    }))

    const offers = [...courseOffers, ...serviceOffers]

    return offers
  }

  async createBaseOffer(offer) {
    try {
      console.log("OFFER BASE: ", offer)
      const result = await this.saveImageAndCreateOffer(offer)

      return result
    } catch (error) {
      console.error("Error creating base offer:", error.message)
      throw error
    }
  }
  async saveImageAndCreateOffer({ name, description, price, type, img }) {
    const imgFileName = uuid.v4() + ".jpg"
    img.mv(path.resolve(__dirname, "..", "static", imgFileName))

    const offer = await Offer.create({
      name,
      description,
      price: parseInt(price),
      type,
      img: imgFileName,
    })

    console.log("OFFER CREATED!")
    return offer
  }
}

module.exports = new CourseService()
