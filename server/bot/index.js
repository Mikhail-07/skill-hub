// telegram_bot.js

// -------------------------
// Imports & Initialization
// -------------------------
const { Telegraf, Markup } = require("telegraf")
const LocalSession = require("telegraf-session-local")
const { addToWaitlist } = require("../controllers/coursesController")
const { fetchAllUsers } = require("../controllers/userController")
const { getAllOffers, createService } = require("../services/courseService")
const userService = require("../services/userService")

const BOT_TOKEN = process.env.BOT_TOKEN
const ADMIN_CHAT_ID = process.env.ADMIN_CHAT_ID
const REPORT_CHAT_ID_1 = process.env.REPORT_CHAT_ID_1
const REPORT_CHAT_ID_2 = process.env.REPORT_CHAT_ID_2

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
    { columns: 1 }
  )
}

function buildAdminKeyboard() {
  return Markup.inlineKeyboard([
    Markup.button.callback("Получить список клиентов", "admin_list_users"),
    Markup.button.callback("Добавить продукт", "admin_add_offer"),
    Markup.button.callback("Все предложения", "admin_all_offers"),
  ])
}

// --------------------
// /start
// --------------------
bot.start(async (ctx) => {
  ctx.session = {}

  console.log("Тип чат ид: ", typeof ctx.chat.id)
  console.log("Тип ид из env: ", typeof ADMIN_CHAT_ID)

  const isAdmin = ctx.chat.id == ADMIN_CHAT_ID

  console.log("id админа: ", ADMIN_CHAT_ID)
  isAdmin
    ? console.log("Вошел админ с id", ctx.chat.id)
    : console.log("Вошел пользователь с id", ADMIN_CHAT_ID)

  // const isAdmin = false

  const text = isAdmin
    ? "Добро пожаловать, Админ!"
    : "Привет! Выберите продукт для регистрации:"

  if (isAdmin) {
    // Для админа отправляем reply-клавиатуру
    await ctx.reply(text, buildMenuKeyboard(isAdmin))
  } else {
    // Для пользователя отправляем inline-клавиатуру и reply-кнопку
    const offers = await getAllOffers()
    await ctx.reply(text, buildOffersKeyboard(offers))
  }
})

// ----------------
// Слушатели бургер меню
// ----------------

bot.hears("🏠 Главное меню", async (ctx) => {
  const offers = await getAllOffers()
  await ctx.reply(
    "Выберите продукт для регистрации:",
    buildOffersKeyboard(offers)
  )
})

bot.hears("📋 Все предложения", async (ctx) => {
  const offers = await getAllOffers()
  await ctx.reply("Все предложения:", buildOffersKeyboard(offers))
})

bot.hears(
  "➕ Добавить продукт",
  adminOnly(async (ctx) => {
    ctx.session.newOffer = { step: "name" }
    await ctx.reply("Введите название продукта:")
  })
)

bot.hears(
  "👥 Список клиентов",
  adminOnly(async (ctx) => {
    const users = await fetchAllUsers()
    if (!users.length) {
      return ctx.reply("Пользователи отсутствуют.")
    }
    const lines = users.map(
      (u) => `#${u.id} ${u.fullName} ${u.phone} (${u.email})`
    )
    await ctx.reply(lines.join("\n"))
  })
)

function adminOnly(handler) {
  return async (ctx) => {
    if (ctx.chat.id != ADMIN_CHAT_ID) {
      await ctx.reply("🚫 У вас нет прав для выполнения этой команды.")
      return
    }
    await handler(ctx)
  }
}

// --------------------
// Главное меню после нажатия START
bot.action("start_flow", async (ctx) => {
  const isAdmin = ctx.chat.id == ADMIN_CHAT_ID
  // const isAdmin = false

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
  console.log("Offer selected:", ctx.match[1], "by user:", ctx.from.id)
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
  console.log(
    "Registration started for offer:",
    ctx.match[1],
    "by:",
    ctx.from.id
  )
  const chatId = ctx.chat.id
  const offer = ctx.session.selectedOffer
  if (!offer) {
    return ctx.reply("Сессия устарела, выберите оффер заново.")
  }
  // Проверяем, есть ли пользователь с такими данными
  const user = await userService.findUserByChatId(chatId)
  if (!user) {
    // Начинаем сбор данных
    ctx.session.registration = { chatId, offerId: offer.id, step: "name" }
    await ctx.reply("Пожалуйста, введите ваше имя:")
    return
  }

  // Уже есть в базе
  await addToWaitlist({ userId: user.id, offerId: offer.id })
  await ctx.reply("Вы успешно зарегистрированы на продукт!")

  // Отчет организатору
  const userLink = ctx.from.username
    ? `https://t.me/${ctx.from.username}`
    : "аккаунт без username"
  const report = `Новая заявка на: ${ctx.session.selectedOffer.name}!\nИмя: ${user.name} ${user.surname}\nTelegram: ${userLink}`
  await ctx.telegram.sendMessage(REPORT_CHAT_ID_1, report)
  await ctx.telegram.sendMessage(REPORT_CHAT_ID_2, report)

  // Очистим сессию
  delete ctx.session.selectedOffer
})

// --------------------
// Получить все продукты админу
bot.action("admin_all_offers", async (ctx) => {
  try {
    const offers = await getAllOffers()
    console.log("Предложения:", offers)

    if (!offers.length) {
      return ctx.reply("Нет доступных предложений.")
    }

    const keyboard = {
      reply_markup: {
        inline_keyboard: offers.map((offer) => [
          {
            text: offer.name,
            callback_data: `offer_${offer.id}`,
          },
        ]),
      },
    }

    await ctx.reply("Все доступные предложения:", keyboard)
  } catch (error) {
    console.error("Ошибка при получении предложений:", error)
    await ctx.reply("Произошла ошибка при получении предложений.")
  }
})
// --------------------

// --------------------
// Обработка текстовых сообщений
bot.on("text", async (ctx) => {
  // Регистрация нового пользователя
  console.log("Регестрируем нового пользователя:", ctx.from.id)
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
          try {
            await userService.registrationFromBot({
              chatId,
              name,
              surname,
              phone,
              email,
            })
            await addToWaitlist({ chatId, offerId })
            await ctx.reply(
              "Регистрация успешна! Вы добавлены в лист ожидания."
            )
            console.log("Сохранен новый пользователь:", ctx.from.id)
          } catch (error) {
            console.error("Ошибка регистрации:", error)
            await ctx.reply("Ошибка регистрации: " + error.message)
          }
          // Отчет организатору
          const userLink = ctx.from.username
            ? `https://t.me/${ctx.from.username}`
            : "аккаунт без username"
          const report = `Зарегестрирован новый человек!\nИмя: ${name} ${surname}\nТелефон: ${phone}\nEmail: ${email}\nTelegram: ${userLink}`
          await ctx.telegram.sendMessage(REPORT_CHAT_ID_1, report)
          await ctx.telegram.sendMessage(REPORT_CHAT_ID_2, report)

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
          // offer.step = "img"
          // await ctx.reply("Введите URL изображения:")
          // break
          // case "img":
          //   offer.img = text
          // offer.step = "type"
          // await ctx.reply("Введите тип продукта (course/service):")
          // break
          // case "type":
          //   offer.type = text
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
// Функция для создания бургер меню
// ----------------

function buildMenuKeyboard(isAdmin) {
  if (isAdmin) {
    return Markup.keyboard([
      ["🏠 Главное меню"],
      ["📋 Все предложения"],
      ["➕ Добавить продукт"],
      ["👥 Список клиентов"],
    ])
      .resize()
      .persistent(true)
  } else {
    return Markup.keyboard([["🏠 Главное меню"]])
      .resize()
      .persistent(true)
  }
}

// ----------------
// Запуск бота
// ----------------
bot.launch().then(() => console.log("Bot started"))

process.once("SIGINT", () => bot.stop("SIGINT"))
process.once("SIGTERM", () => bot.stop("SIGTERM"))
