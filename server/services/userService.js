const { User } = require("../models/models")

async function registrationFromBot({ chatId, name, surname, phone, email }) {
  if (!chatId) {
    throw new Error("Chat ID обязателен для регистрации через бота")
  }

  const candidate = await this.findUserByChatId(chatId)

  if (candidate) {
    throw new Error("Пользователь с таким chatId уже существует")
  }

  const user = await User.create({
    chatId,
    name,
    surname,
    phone,
    email,
    role: "USER",
  })

  return user
}

module.exports = {
  registrationFromBot,
}
