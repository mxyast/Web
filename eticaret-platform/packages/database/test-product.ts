import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const brand = await prisma.brand.create({
    data: { name: 'AI Brand Test', slug: 'ai-brand-test' }
  });
  const category = await prisma.category.create({
    data: { name: 'AI Category Test', slug: 'ai-category-test' }
  });

  const product = await prisma.product.create({
    data: {
      name: 'AI Smart Product',
      slug: 'ai-smart-product',
      description: 'Test product created to ensure DB works',
      brandId: brand.id,
      categoryId: category.id,
      isB2C: true,
      isB2B: true
    }
  });

  const variant = await prisma.variant.create({
    data: {
      productId: product.id,
      sku: 'AI-TEST-001',
      images: ['https://placehold.co/600x400/000000/FFFFFF/png']
    }
  });

  await prisma.price.create({
    data: {
      variantId: variant.id,
      retailPrice: 999.99,
      listA: 800.00,
      listB: 750.00,
      listC: 750.00,
      listD: 750.00,
      taxRate: 20
    }
  });

  await prisma.inventory.create({
    data: {
      variantId: variant.id,
      totalStock: 50,
      b2cReserveRatio: 20
    }
  });

  console.log("Product successfully created!");
  const allProducts = await prisma.product.findMany({ include: { brand: true, variants: { include: { price: true, inventory: true } } } });
  console.log("Total Products in DB:", allProducts.length);
  console.log("Latest Product:", JSON.stringify(allProducts[0], null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
