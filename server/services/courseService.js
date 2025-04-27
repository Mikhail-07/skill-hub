// services/courseService.js

const { Course, Lesson, Service } = require("../models")
const { saveImageAndCreateOffer } = require("../utils/fileService") // предположительно у тебя где-то так называется

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
      const { name, description, price, type, img } = offer
      const result = await saveImageAndCreateOffer(
        name,
        description,
        price,
        type,
        img
      )

      return result
    } catch (error) {
      console.error("Error creating base offer:", error.message)
      throw error // чтобы можно было поймать выше
    }
  }
}

module.exports = new CourseService()
