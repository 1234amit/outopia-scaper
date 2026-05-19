// require("dotenv").config();

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

//     if (!products || products.length === 0) {
//       return bot.sendMessage(chatId, "No products found");
//     }

//     const p = products[0];

//     const image =
//       p.images?.[0] || "https://via.placeholder.com/300";

//     await bot.sendPhoto(chatId, image, {
//       caption: `
// ${p.name}
// 💰 $${p.price}
// 🔗 ${p.url}
//       `
//     });

//   } catch (err) {
//     console.log(err.message);
//     bot.sendMessage(chatId, "Error searching products");
//   }
// });

// console.log("Telegram bot running...");


require("dotenv").config();

const TelegramBot = require("node-telegram-bot-api");
const axios = require("axios");

const token = process.env.TELEGRAM_BOT_TOKEN;
const API_URL = process.env.API_URL || "http://localhost:3000";

if (!token) {
  console.error("Missing TELEGRAM_BOT_TOKEN in environment variables");
  process.exit(1);
}

const bot = new TelegramBot(token, {
  polling: true,
});

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const query = msg.text;

  if (!query || query.startsWith("/")) {
    return bot.sendMessage(chatId, "Send me a product search, for example: men shoes under 100");
  }

  try {
    console.log("Telegram query:", query);
    console.log("Calling API:", `${API_URL}/search`);

    const res = await axios.post(`${API_URL}/search`, {
      query,
    });

    const products = res.data;

    if (!products || products.length === 0) {
      return bot.sendMessage(chatId, "No products found");
    }

    const p = products[0];

    const image = p.images?.[0] || "https://via.placeholder.com/300";

    await bot.sendPhoto(chatId, image, {
      caption: `
${p.name}
💰 $${p.price}
🔗 ${p.url}
      `,
    });
  } catch (err) {
    console.error("Bot search error:", err.response?.data || err.message);
    bot.sendMessage(chatId, "Error searching products");
  }
});

console.log("Telegram bot running...");
console.log("API URL:", API_URL);