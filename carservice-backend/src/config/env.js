const dotenv = require("dotenv");

dotenv.config();

const env = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || "development",
  databaseUrl: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET,
  telegramBotToken: process.env.TELEGRAM_BOT_TOKEN,
};

module.exports = env;