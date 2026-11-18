const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// GET /api/categories
const getCategories = async (req, res, next) => {
  try {
    const categories = await prisma.serviceCategory.findMany({
      orderBy: { order: 'asc' },
    });
    res.json({ success: true, data: categories });
  } catch (err) {
    next(err);
  }
};

module.exports = { getCategories };