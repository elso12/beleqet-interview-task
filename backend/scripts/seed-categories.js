const { PrismaClient } = require('@prisma/client');

const DEFAULT_CATEGORIES = [
  { label: 'Information Technology', icon: 'laptop' },
  { label: 'Software Design And Development', icon: 'laptop' },
  { label: 'Marketing And Advertisement', icon: 'megaphone' },
  { label: 'Accounting And Finance', icon: 'landmark' },
  { label: 'Human Resource And Talent Management', icon: 'users' },
  { label: 'Creative Art And Design', icon: 'palette' },
  { label: 'Customer Service And Care', icon: 'headphones' },
  { label: 'Sales And Promotion', icon: 'trending-up' },
  { label: 'Health Care', icon: 'heart-pulse' },
  { label: 'Education And Training', icon: 'graduation-cap' },
  { label: 'Engineering', icon: 'cog' },
  { label: 'Other', icon: 'more-horizontal' },
];

function toSlug(label) {
  return label
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function main() {
  const prisma = new PrismaClient();
  try {
    const count = await prisma.jobCategory.count();
    if (count > 0) {
      console.log(`Categories already exist (${count}), skipping seed.`);
      return;
    }
    for (const cat of DEFAULT_CATEGORIES) {
      const slug = toSlug(cat.label);
      await prisma.jobCategory.upsert({
        where: { slug },
        update: {},
        create: { slug, label: cat.label, icon: cat.icon },
      });
    }
    console.log(`Seeded ${DEFAULT_CATEGORIES.length} job categories.`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error('Category seed failed:', e.message);
  process.exit(1);
});
