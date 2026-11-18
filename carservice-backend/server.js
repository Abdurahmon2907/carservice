require('dotenv').config();
const app = require('./src/app');
const bot = require('./src/bot/bot');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});

// Bot runs independently — errors here won't crash Express
bot.launch().then(() => {
  console.log('✅ Telegram bot started');
}).catch((err) => {
  console.error('❌ Bot failed to start:', err.message);
  console.log('⚠️  Server continues without bot');
});

process.once('SIGINT',  () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));