const path = require("path")
const uuid = require("uuid")
const { Course, Lesson, Service, Offer } = require("../models/models")

async function getAllOffers() {
  const offers = await Offer.findAll()
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

async function createService(serviceData) {
  try {
    console.log("Создание сервиса:", serviceData)

    // Сначала создаем оффер
    const createdOffer = await createBaseOffer(serviceData)

    // Затем создаем сервис, привязывая его к офферу
    const createdService = await Service.create({
      offerId: createdOffer.id,
      typeService: "service", // например 'lecture', 'consultation' и т.д.
    })

    console.log("SERVICE CREATED!")
    return { offer: createdOffer, service: createdService }
  } catch (error) {
    console.error("Ошибка при создании сервиса:", error.message)
    throw error
  }
}

// Экспортируем все функции вместе
module.exports = {
  getAllOffers,
  createBaseOffer,
  createService,
}
