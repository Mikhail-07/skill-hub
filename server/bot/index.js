const { Telegraf } = require("telegraf");
const { addToWaitlist } = require("../controllers/coursesController");

const bot = new Telegraf(process.env.BOT_TOKEN);

const userData = {}; // Сохранение данных пользователя временно

bot.start((ctx) => {
  ctx.reply(
    'Привет! Тут ты можешь зарегистрироваться на курс "Внутренний критик".' +
      "\n\nДля предзаписи на курс нужно ответить на несколько вопросов 😊"
  );
  ctx.reply("Введите ваше имя 😎");
  userData[ctx.chat.id] = { step: "name" };
});

bot.on("text", async (ctx) => {
  const chatId = ctx.chat.id;

  // Если данные для пользователя не сохранены
  if (!userData[chatId]) {
    userData[chatId] = { step: "name" };
  }

  const step = userData[chatId].step;
  const text = ctx.message.text;

  if (step === "name") {
    userData[chatId].name = text;
    userData[chatId].step = "surname";
    return ctx.reply("Введите вашу фамилию 😃");
  } else if (step === "surname") {
    userData[chatId].surname = text;
    userData[chatId].step = "email";
    return ctx.reply("Пожалуйста, напиши свой email 😉");
  } else if (step === "email") {
    userData[chatId].email = text;

    // Проверка и сохранение
    try {
      const response = await addToWaitlist({
        chatId,
        name: userData[chatId].name,
        surname: userData[chatId].surname,
        email: userData[chatId].email,
        courseId: "1",
      });
      ctx.reply(response.message);
    } catch (error) {
      ctx.reply(
        "Произошла ошибка при регистрации, попробуйте позже или обратитесь в саппорт"
      );
      console.error(error);
    } finally {
      // Очистить данные после регистрации
      delete userData[chatId];
    }
  }
});

module.exports = bot;
