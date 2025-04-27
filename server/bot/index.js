// telegram_bot.js

// -------------------------
// Imports & Initialization
// -------------------------
const { Telegraf, Markup } = require("telegraf")
const LocalSession = require("telegraf-session-local")
const { addToWaitlist } = require("../controllers/coursesController")
const {
  findUserByChatId,
  registration,
  fetchAllUsers,
} = require("../controllers/userController")
const { getAllOffers, createService } = require("../services/courseService")

const BOT_TOKEN = process.env.BOT_TOKEN
const REPORT_CHAT_ID = process.env.REPORT_CHAT_ID || 368991424
const ADMIN_CHAT_ID = 368991424

const bot = new Telegraf(BOT_TOKEN)

// LocalSession middleware
const sessions = new LocalSession({ database: "session_db.json" })
bot.use(sessions.middleware())

// --------------------
// Keyboards
// --------------------
function buildOffersKeyboard(offers) {
  return Markup.inlineKeyboard(
    offers.map((o) => Markup.button.callback(o.name, `offer_${o.id}`)),
    { columns: 2 }
  )
}

function buildAdminKeyboard() {
  return Markup.inlineKeyboard([
    Markup.button.callback("Получить список клиентов", "admin_list_users"),
    Markup.button.callback("Добавить продукт", "admin_add_offer"),
    Markup.button.callback("Все предложения", "admin_all_offers"),
  ])
}

function buildStartKeyboard() {
  return Markup.inlineKeyboard([Markup.button.callback("START", "start_flow")])
}

// --------------------
// /start -> только кнопка START
bot.start(async (ctx) => {
  // Сбросим сессию аккуратно
  ctx.session = {}
  await ctx.reply(
    "Добро пожаловать! Нажмите START для продолжения",
    buildStartKeyboard()
  )
})

// --------------------
// Главное меню после нажатия START
bot.action("start_flow", async (ctx) => {
  const isAdmin = ctx.chat.id === ADMIN_CHAT_ID
  const text = isAdmin
    ? "Добро пожаловать, Админ!"
    : "Привет! Выберите продукт для регистрации:"
  let keyboard
  if (isAdmin) {
    keyboard = buildAdminKeyboard()
  } else {
    const offers = await getAllOffers()
    keyboard = buildOffersKeyboard(offers)
  }
  // удалим кнопку START
  await ctx.editMessageText(text, keyboard)
})

// --------------------
// Выбор продукта
bot.action(/offer_(\d+)/, async (ctx) => {
  const offerId = ctx.match[1]
  const offers = await getAllOffers()
  const offer = offers.find((o) => o.id == offerId)
  if (!offer) return ctx.reply("Продукт не найден.")

  // Сохраним выбранный оффер
  ctx.session.selectedOffer = offer

  const desc = `*${offer.name}*\nЦена: ${offer.price}\n${offer.description}`
  await ctx.replyWithMarkdown(
    desc,
    Markup.inlineKeyboard([
      Markup.button.callback("Зарегистрироваться", `register_${offer.id}`),
      Markup.button.callback("<< Назад", "start_flow"),
    ])
  )
})

// --------------------
// Регистрация на оффер
bot.action(/register_(\d+)/, async (ctx) => {
  const chatId = ctx.chat.id
  const offer = ctx.session.selectedOffer
  if (!offer) {
    return ctx.reply("Сессия устарела, выберите оффер заново.")
  }

  const user = await findUserByChatId(chatId)
  if (!user) {
    // Начинаем сбор данных
    ctx.session.registration = { chatId, offerId: offer.id, step: "name" }
    await ctx.reply("Пожалуйста, введите ваше имя:")
    return
  }

  // Уже есть в базе
  await addToWaitlist({ chatId, offerId: offer.id })
  await ctx.reply("Вы успешно зарегистрированы на продукт!")

  // Отчет организатору
  const userLink = ctx.from.username
    ? `https://t.me/${ctx.from.username}`
    : "аккаунт без username"
  const report = `Новый участник!\nИмя: ${user.name} ${user.surname}\nTelegram: ${userLink}`
  await ctx.telegram.sendMessage(REPORT_CHAT_ID, report)

  // Очистим сессию
  delete ctx.session.selectedOffer
})

// --------------------
// Получить все продукты админу
bot.action("admin_all_offers", async (ctx) => {
  const offers = await getAllOffers()
  if (!offers.length) {
    return ctx.reply("Нет доступных предложений.")
  }
  const keyboard = buildOffersKeyboard(offers)
  await ctx.editMessageText("Все доступные предложения:", keyboard)
})
// --------------------

// --------------------
// Обработка текстовых сообщений
bot.on("text", async (ctx) => {
  // Регистрация нового пользователя
  if (ctx.session.registration) {
    const reg = ctx.session.registration
    const text = ctx.message.text.trim()
    try {
      switch (reg.step) {
        case "name":
          reg.name = text
          reg.step = "surname"
          await ctx.reply("Введите вашу фамилию:")
          break
        case "surname":
          reg.surname = text
          reg.step = "phone"
          await ctx.reply("Введите ваш номер телефона:")
          break
        case "phone":
          reg.phone = text
          reg.step = "email"
          await ctx.reply("Введите ваш email:")
          break
        case "email":
          reg.email = text
          // Сохраняем нового пользователя и ждем лист
          const { chatId, offerId, name, surname, phone, email } = reg
          await registration({ chatId, name, surname, phone, email })
          await addToWaitlist({ chatId, offerId })
          await ctx.reply("Регистрация успешна! Вы добавлены в лист ожидания.")

          // Отчет организатору
          const userLink = ctx.from.username
            ? `https://t.me/${ctx.from.username}`
            : "аккаунт без username"
          const report = `Новый участник!\nИмя: ${name} ${surname}\nТелефон: ${phone}\nEmail: ${email}\nTelegram: ${userLink}`
          await ctx.telegram.sendMessage(REPORT_CHAT_ID, report)

          // Очистка
          delete ctx.session.registration
          delete ctx.session.selectedOffer
          break
        default:
          // Неизвестный шаг
          delete ctx.session.registration
          await ctx.reply("Произошла ошибка, начните регистрацию заново.")
          break
      }
    } catch (err) {
      console.error("Ошибка при регистрации:", err)
      delete ctx.session.registration
      await ctx.reply("Произошла ошибка. Попробуйте снова.")
    }
    return
  }

  // Создание нового оффера (админ)
  if (ctx.session.newOffer) {
    const offer = ctx.session.newOffer
    const text = ctx.message.text.trim()
    try {
      switch (offer.step) {
        case "name":
          offer.name = text
          offer.step = "description"
          await ctx.reply("Введите описание продукта:")
          break
        case "description":
          offer.description = text
          offer.step = "price"
          await ctx.reply("Введите цену (число):")
          break
        case "price":
          const price = parseInt(text)
          if (isNaN(price)) {
            return ctx.reply("Пожалуйста, введите корректное число:")
          }
          offer.price = price
          offer.step = "img"
          await ctx.reply("Введите URL изображения:")
          break
        case "img":
          offer.img = text
          offer.step = "type"
          await ctx.reply("Введите тип продукта (course/service):")
          break
        case "type":
          offer.type = text
          await createService(offer)
          await ctx.reply("✅ Продукт успешно создан!")
          delete ctx.session.newOffer
          break
        default:
          delete ctx.session.newOffer
          await ctx.reply("Неизвестный шаг создания продукта.")
          break
      }
    } catch (err) {
      console.error("Ошибка создания оффера:", err)
      delete ctx.session.newOffer
      await ctx.reply(
        "Произошла ошибка при создании продукта. Попробуйте снова."
      )
    }
    return
  }
})

// -----------------------
// Админ: Список клиентов
// -----------------------
bot.action("admin_list_users", async (ctx) => {
  const users = await fetchAllUsers()
  if (!users.length) {
    return ctx.reply("Пользователи отсутствуют.")
  }
  const lines = users.map(
    (u) => `#${u.id} ${u.fullName} ${u.phone} (${u.email})`
  )
  await ctx.reply(lines.join("\n"))
})

// -----------------------
// Админ: Начало создания оффера
// -----------------------
bot.action("admin_add_offer", async (ctx) => {
  ctx.session.newOffer = { step: "name" }
  await ctx.reply("Введите название продукта:")
})

// ----------------
// Запуск бота
// ----------------
bot.launch().then(() => console.log("Bot started"))

process.once("SIGINT", () => bot.stop("SIGINT"))
process.once("SIGTERM", () => bot.stop("SIGTERM"))
