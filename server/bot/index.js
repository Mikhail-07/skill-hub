// telegram_bot.js

// -------------------------
// Imports & Initialization
// -------------------------
const { Telegraf, Markup, session } = require("telegraf")
const {
  getAllOffers,
  addToWaitlist,
  createBaseOffer,
} = require("../controllers/coursesController")
const {
  findUserByChatId,
  registration,
  fetchAllUsers,
} = require("../controllers/userController")

const BOT_TOKEN = process.env.BOT_TOKEN
const REPORT_CHAT_ID = process.env.REPORT_CHAT_ID || 368991424
const ADMIN_CHAT_ID = 368991424

const bot = new Telegraf(BOT_TOKEN)
bot.use((ctx, next) => {
  if (!ctx.session) {
    ctx.session = {}
  }
  return next()
})

// ---------------
// Helper methods
// ---------------
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
  ])
}

// -----------------------
// Start & Main Menu Flow
// -----------------------
bot.start(async (ctx) => {
  ctx.session = {} // reset session
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
  return ctx.reply(text, keyboard)
})

// --------------------
// Offer Selection Flow
// --------------------
bot.action(/offer_(\d+)/, async (ctx) => {
  const offerId = ctx.match[1]
  const offers = await getAllOffers()
  const offer = offers.find((o) => o.id == offerId)
  if (!offer) return ctx.reply("Продукт не найден.")

  ctx.session.selectedOffer = offer
  const desc = `*${offer.name}*\nЦена: ${offer.price}\n${offer.description}`
  return ctx.replyWithMarkdown(
    desc,
    Markup.inlineKeyboard([
      Markup.button.callback("Зарегистрироваться", `register_${offer.id}`),
      Markup.button.callback("<< Назад", "go_back"),
    ])
  )
})

// Navigate back to main menu
bot.action("go_back", (ctx) => ctx.invoke("start"))

// -----------------------
// Registration Flow
// -----------------------
bot.action(/register_(\d+)/, async (ctx) => {
  const chatId = ctx.chat.id
  const offer = ctx.session.selectedOffer

  // Check if user exists
  const user = await findUserByChatId(chatId)
  if (!user) {
    // begin collection
    ctx.session.registration = { chatId, offerId: offer.id, step: "name" }
    return ctx.reply("Пожалуйста, введите ваше имя:")
  }

  // Direct waitlist registration for existing user
  await addToWaitlist({ chatId, offerId: offer.id })
  await ctx.reply("Вы успешно зарегистрированы на продукт!")

  // Report to organizer
  const userLink = ctx.from.username
    ? `https://t.me/${ctx.from.username}`
    : "аккаунт без username"
  const report = `Новый участник!\nИмя: ${user.name} ${user.surname}\nTelegram: ${userLink}`
  await ctx.telegram.sendMessage(REPORT_CHAT_ID, report)

  ctx.session = {} // clear session
})

bot.on("text", async (ctx) => {
  // Проверяем, какой процесс активен (регистрация или создание оффера)
  if (ctx.session.registration) {
    // Обработка регистрации пользователя
    const reg = ctx.session.registration
    const text = ctx.message.text

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
          // Финализация регистрации
          const { chatId, offerId, name, surname, phone, email } = reg
          await registration({
            chatId,
            name,
            surname,
            phone,
            email,
          })
          await addToWaitlist({ chatId, offerId })

          await ctx.reply("Регистрация успешна! Вы добавлены в лист ожидания.")

          const userLink = ctx.from.username
            ? `https://t.me/${ctx.from.username}`
            : "аккаунт без username"
          const report = `Новый участник!\nИмя: ${name} ${surname}\nТелефон: ${phone}\nEmail: ${email}\nTelegram: ${userLink}`
          await ctx.telegram.sendMessage(REPORT_CHAT_ID, report)

          ctx.session.registration = null
          break
      }
    } catch (error) {
      console.error("Ошибка при регистрации:", error)
      await ctx.reply(
        "Произошла ошибка при регистрации. Пожалуйста, начните заново."
      )
      ctx.session.registration = null
    }
  } else if (ctx.session.newOffer) {
    // Обработка создания нового оффера
    const no = ctx.session.newOffer
    const t = ctx.message.text

    try {
      switch (no.step) {
        case "name":
          no.name = t
          no.step = "description"
          await ctx.reply("Введите описание продукта:")
          break
        case "description":
          no.description = t
          no.step = "price"
          await ctx.reply("Введите цену (число):")
          break
        case "price":
          no.price = parseInt(t, 10)
          if (isNaN(no.price)) {
            await ctx.reply("Пожалуйста, введите корректное число для цены:")
            return
          }
          no.step = "img"
          await ctx.reply("Введите URL изображения:")
          break
        case "img":
          no.img = t
          no.step = "type"
          await ctx.reply("Введите тип продукта (course/service):")
          break
        case "type":
          no.type = t
          await createBaseOffer(no)
          await ctx.reply("Новый продукт успешно добавлен!")
          ctx.session.newOffer = null
          return
      }
    } catch (error) {
      console.error("Ошибка при создании оффера:", error)
      await ctx.reply(
        "Произошла ошибка при создании продукта. Пожалуйста, начните заново."
      )
      ctx.session.newOffer = null
    }
  }
})
// ----------------
// Admin: List Users
// ----------------
bot.action("admin_list_users", async (ctx) => {
  const users = await fetchAllUsers()
  if (!users.length) return ctx.reply("Пользователи отсутствуют.")

  const lines = users.map(
    (u) => `#${u.id} ${u.fullName} ${u.phone} (${u.email})`
  )
  return ctx.reply(lines.join("\n"))
})

bot.action("admin_add_offer", async (ctx) => {
  ctx.session.newOffer = { step: "name" }
  return ctx.reply("Введите название продукта:")
})

// --------------
// Launch Bot
// --------------
bot.launch().then(() => console.log("Bot started"))

// enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"))
process.once("SIGTERM", () => bot.stop("SIGTERM"))
