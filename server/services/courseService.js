const path = require("path")
const uuid = require("uuid")
const { Course, Lesson, Service, Offer } = require("../models/models")

async function getAllOffers() {
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

async function saveImageAndCreateOffer({
  name,
  description,
  price,
  type,
  img,
}) {
  let imgFileName = null

  if (img && img.mimetype && img.mimetype.startsWith("image/")) {
    try {
      imgFileName = uuid.v4() + path.extname(img.name) // сохраняем оригинальное расширение
      await img.mv(path.resolve(__dirname, "..", "static", imgFileName))
    } catch (error) {
      console.error("Ошибка при сохранении изображения:", error)
      imgFileName = null // если не удалось сохранить, продолжаем без картинки
    }
  } else {
    console.log(
      "Файл отсутствует или не является изображением. Сохраняем без картинки."
    )
  }

  const offer = await Offer.create({
    name,
    description,
    price: parseInt(price, 10),
    type,
    img: imgFileName,
  })

  console.log("OFFER CREATED!")
  return offer
}

async function createBaseOffer(offer) {
  try {
    console.log("OFFER BASE: ", offer)
    const result = await saveImageAndCreateOffer(offer)

    return result
  } catch (error) {
    console.error("Error creating base offer:", error.message)
    throw error
  }
}

// Экспортируем все функции вместе
module.exports = {
  getAllOffers,
  createBaseOffer,
}
