const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const categories = [
    { name: 'Car Wash',            nameRu: 'Автомойка',         nameUz: 'Avtomoylik',     slug: 'car-wash',        icon: '🚿', order: 1 },
    { name: 'Detailing',           nameRu: 'Детейлинг',         nameUz: 'Deteyling',      slug: 'detailing',       icon: '✨', order: 2 },
    { name: 'Tuning',              nameRu: 'Тюнинг',            nameUz: 'Tyuning',        slug: 'tuning',          icon: '🔧', order: 3 },
    { name: 'Mechanical Services', nameRu: 'Автосервис',        nameUz: 'Avtoservis',     slug: 'mechanical',      icon: '⚙️', order: 4 },
    { name: 'Tire Services',       nameRu: 'Шиномонтаж',        nameUz: 'Shina xizmati',  slug: 'tire-services',   icon: '🛞', order: 5 },
    { name: 'Emergency Road',      nameRu: 'Помощь на дороге',  nameUz: 'Yo\'l yordami',  slug: 'emergency-road',  icon: '🚨', order: 6 },
    { name: 'Accessories & Parts', nameRu: 'Автозапчасти',      nameUz: 'Ehtiyot qismlar',slug: 'accessories',     icon: '🛒', order: 7 },
    { name: 'Insurance & Docs',    nameRu: 'Страховка и документы', nameUz: 'Sug\'urta',  slug: 'insurance',       icon: '📋', order: 8 },
  ];

  for (const cat of categories) {
    await prisma.serviceCategory.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }
  console.log('✅ Categories seeded');
}

main().catch(console.error).finally(() => prisma.$disconnect());