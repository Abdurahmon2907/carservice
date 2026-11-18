const { Telegraf } = require('telegraf');

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

// /start command — no keyboard button, menu button handles opening the app
bot.start((ctx) => {
  const firstName = ctx.from.first_name || 'there';

  ctx.reply(
    `👋 Salom, ${firstName}!\n\nCarService — Toshkentdagi avtomobil xizmatlari.\n\nChap pastdagi 🚗 Xizmatlar tugmasini bosing va eng yaqin xizmatlarni toping.`
  );
});

bot.help((ctx) => {
  ctx.reply(
    '📋 Buyruqlar:\n/start — Botni boshlash\n/help — Yordam\n\nMuammo bo\'lsa: @yoursupport'
  );
});

bot.catch((err, ctx) => {
  console.error(`Bot error for ${ctx.updateType}:`, err.message);
});

module.exports = bot;