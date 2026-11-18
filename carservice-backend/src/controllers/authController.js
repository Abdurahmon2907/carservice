const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const { generateToken } = require('../config/jwt');

const prisma = new PrismaClient();

// POST /api/auth/register
const register = async (req, res, next) => {
  try {
    const { firstName, lastName, phone, email, password, role } = req.body;

    // Check if user already exists
    const existing = await prisma.user.findFirst({
      where: { OR: [{ phone }, { email }] },
    });
    if (existing) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        phone,
        email,
        passwordHash,
        role: role === 'BUSINESS_OWNER' ? 'BUSINESS_OWNER' : 'USER',
      },
    });

    const token = generateToken({ id: user.id, role: user.role });

    res.status(201).json({
      success: true,
      token,
      user: { id: user.id, firstName: user.firstName, role: user.role },
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/auth/login
const login = async (req, res, next) => {
  try {
    const { phone, email, password } = req.body;

    const user = await prisma.user.findFirst({
      where: { OR: [{ phone }, { email }] },
    });

    if (!user || !user.passwordHash) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = generateToken({ id: user.id, role: user.role });

    res.json({
      success: true,
      token,
      user: { id: user.id, firstName: user.firstName, role: user.role },
    });
  } catch (err) {
    next(err);
  }
};

const verifyTelegramInitData = require('../utils/verifyTelegram');

// POST /api/auth/telegram
// Called when Mini App opens — auto login/register via Telegram
const telegramAuth = async (req, res, next) => {
  try {
    const { initData } = req.body;

    if (!initData) {
      return res.status(400).json({ success: false, message: 'initData is required' });
    }

    // Verify the data actually came from Telegram
    const tgUser = verifyTelegramInitData(initData);

    // Find existing user or create new one
    let user = await prisma.user.findUnique({
      where: { telegramId: String(tgUser.id) },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          telegramId: String(tgUser.id),
          firstName:  tgUser.first_name,
          lastName:   tgUser.last_name  || null,
          role:       'USER',
        },
      });
    }

    const token = generateToken({ id: user.id, role: user.role });

    res.json({
      success: true,
      token,
      user: {
        id:        user.id,
        firstName: user.firstName,
        role:      user.role,
        telegramId: user.telegramId,
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login, telegramAuth };