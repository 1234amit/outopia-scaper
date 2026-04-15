// const TelegramBot = require("node-telegram-bot-api");
// const axios = require("axios");

// const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, {
//   polling: true
// });

// bot.on("message", async (msg) => {
//   const chatId = msg.chat.id;
//   const query = msg.text;

//   try {
//     const res = await axios.post("http://localhost:3000/search", {
//       query
//     });

//     const products = res.data;

//     // if (!products.length) {
//     //   return bot.sendMessage(chatId, "No products found");
//     // }

//     if (!products || products.length === 0) {
//         return bot.sendMessage(chatId, "No products found");
//     }

//     const p = products[0];

//     const image = p.images?.[0] || "https://via.placeholder.com/300";

//     bot.sendPhoto(chatId, image, {
//         caption: `
//         ${p.name}
//     💰 $${p.price}
//     🔗 ${p.url}
//       `
//     });
//   } catch (err) {
//     bot.sendMessage(chatId, "Error searching products");
//   }
// });

// console.log("Telegram bot running...");



require("dotenv").config();

const TelegramBot = require("node-telegram-bot-api");
const axios = require("axios");

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, {
  polling: true
});

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const query = msg.text;

  try {
    const res = await axios.post("http://localhost:3000/search", {
      query
    });

    const products = res.data;

    if (!products || products.length === 0) {
      return bot.sendMessage(chatId, "No products found");
    }

    const p = products[0];

    const image =
      p.images?.[0] || "https://via.placeholder.com/300";

    await bot.sendPhoto(chatId, image, {
      caption: `
${p.name}
💰 $${p.price}
🔗 ${p.url}
      `
    });

  } catch (err) {
    console.log(err.message);
    bot.sendMessage(chatId, "Error searching products");
  }
});

console.log("Telegram bot running...");