const crypto = require('crypto');

/**
 * Verifies that initData actually came from Telegram
 * and was not faked by someone.
 * https://core.telegram.org/bots/webapps#validating-data-received-via-the-mini-app
 */
const verifyTelegramInitData = (initDataString) => {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;

  // Parse the query string
  const params = new URLSearchParams(initDataString);
  const hash   = params.get('hash');

  if (!hash) throw { status: 400, message: 'Missing hash' };

  // Remove hash from params before checking
  params.delete('hash');

  // Sort keys alphabetically and join as key=value\n
  const dataCheckString = Array.from(params.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}=${v}`)
    .join('\n');

  // HMAC-SHA256 with key = HMAC-SHA256("WebAppData", botToken)
  const secretKey = crypto
    .createHmac('sha256', 'WebAppData')
    .update(botToken)
    .digest();

  const expectedHash = crypto
    .createHmac('sha256', secretKey)
    .update(dataCheckString)
    .digest('hex');

  if (expectedHash !== hash) {
    throw { status: 401, message: 'Invalid Telegram data' };
  }

  // Parse and return the user object
  const userJson = params.get('user');
  if (!userJson) throw { status: 400, message: 'No user in initData' };

  return JSON.parse(userJson);
};

module.exports = verifyTelegramInitData;