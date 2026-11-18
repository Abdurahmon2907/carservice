const router = require('express').Router();
const { register, login, telegramAuth } = require('../controllers/authController');

router.post('/register', register);
router.post('/login',    login);
router.post('/telegram', telegramAuth);

module.exports = router;