import { PrismaClient, Role, Platform, PriceList } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding started (PostgreSQL Mode)...");

  // 1. Create Users
  const passwordHash = await bcrypt.hash("password123", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@eticaret.com" },
    update: {},
    create: {
      email: "admin@eticaret.com",
      name: "Admin User",
      passwordHash,
      role: Role.ADMIN,
      isVerified: true,
    },
  });

  const dealer = await prisma.user.upsert({
    where: { email: "dealer@eticaret.com" },
    update: {},
    create: {
      email: "dealer@eticaret.com",
      name: "Toptan Bayi",
      passwordHash,
      role: Role.DEALER,
      isVerified: true,
      b2bProfile: {
        create: {
          companyName: "Tech Wholesale Ltd",
          taxOffice: "Mecidiyeköy",
          taxNumber: "1234567890",
          priceList: PriceList.LIST_B,
          isApproved: true,
          documents: [],
        },
      },
    },
  });

  const customer = await prisma.user.upsert({
    where: { email: "customer@eticaret.com" },
    update: {},
    create: {
      email: "customer@eticaret.com",
      name: "Ahmet Müşteri",
      passwordHash,
      role: Role.CUSTOMER,
      isVerified: true,
    },
  });

  console.log("Users created.");

  // 2. Create Brands
  const mioji = await prisma.brand.upsert({
    where: { slug: "mioji" },
    update: {},
    create: { name: "Mioji", slug: "mioji" },
  });

  const baseus = await prisma.brand.upsert({
    where: { slug: "baseus" },
    update: {},
    create: { name: "Baseus", slug: "baseus" },
  });

  const ugreen = await prisma.brand.upsert({
    where: { slug: "ugreen" },
    update: {},
    create: { name: "Ugreen", slug: "ugreen" },
  });

  // 3. Create Categories
  const chargers = await prisma.category.upsert({
    where: { slug: "sarj-cihazlari" },
    update: {},
    create: { name: "Şarj Cihazları", slug: "sarj-cihazlari" },
  });

  const cables = await prisma.category.upsert({
    where: { slug: "kablolar" },
    update: {},
    create: { name: "Kablolar", slug: "kablolar" },
  });

  // 4. Create Products
  const p1 = await prisma.product.upsert({
    where: { slug: "mioji-powercore-20k" },
    update: {},
    create: {
      name: "Mioji PowerCore 20K SuperCharge",
      slug: "mioji-powercore-20k",
      description: "20.000mAh kapasiteli, 65W GaN destekli ultra hızlı powerbank.",
      brandId: mioji.id,
      categoryId: chargers.id,
      isB2C: true,
      isB2B: true,
      variants: {
        create: {
          sku: "MJ-PWR-20K-SLV",
          color: "Gümüş",
          images: [],
          price: {
            create: {
              retailPrice: 2499.0,
              listA: 950.0,
              listB: 920.0,
              listC: 890.0,
              listD: 860.0,
            },
          },
          inventory: {
            create: {
              totalStock: 200,
              b2cReserveRatio: 30,
            },
          },
        },
      },
    },
  });

  const p2 = await prisma.product.upsert({
    where: { slug: "baseus-gan5-pro-100w" },
    update: {},
    create: {
      name: "Baseus GaN5 Pro 100W Hızlı Şarj Cihazı",
      slug: "baseus-gan5-pro-100w",
      description: "Yüksek performanslı GaN teknolojili şarj cihazı.",
      brandId: baseus.id,
      categoryId: chargers.id,
      isB2C: true,
      isB2B: true,
      variants: {
        create: {
          sku: "BS-GAN5-100W-BLK",
          color: "Siyah",
          images: [],
          price: {
            create: {
              retailPrice: 1249.0,
              listA: 450.0,
              listB: 420.0,
              listC: 390.0,
              listD: 360.0,
            },
          },
          inventory: {
            create: {
              totalStock: 500,
              b2cReserveRatio: 20,
            },
          },
        },
      },
    },
  });

  const p3 = await prisma.product.upsert({
    where: { slug: "mioji-ultra-link-c" },
    update: {},
    create: {
      name: "Mioji UltraLink USB-C to USB-C Kablo",
      slug: "mioji-ultra-link-c",
      description: "240W PD desteği ve 40Gbps veri transfer hızı.",
      brandId: mioji.id,
      categoryId: cables.id,
      isB2C: true,
      isB2B: true,
      variants: {
        create: {
          sku: "MJ-CBL-240W-2M",
          sizeLength: "2m",
          color: "Titanyum",
          images: [],
          price: {
            create: {
              retailPrice: 499.0,
              listA: 150.0,
              listB: 140.0,
              listC: 130.0,
              listD: 120.0,
            },
          },
          inventory: {
            create: { totalStock: 1000, b2cReserveRatio: 50 },
          },
        },
      },
    },
  });

  const p4 = await prisma.product.upsert({
    where: { slug: "ugreen-hdmi-21-bulk" },
    update: {},
    create: {
      name: "Ugreen HDMI 2.1 Kablo (50 Adet Koli)",
      slug: "ugreen-hdmi-21-bulk",
      description: "Toptan satış için 50 adetlik HDMI kablo kolisi.",
      brandId: ugreen.id,
      categoryId: cables.id,
      isB2C: false,
      isB2B: true,
      variants: {
        create: {
          sku: "UG-HDMI-50PK",
          sizeLength: "2m",
          images: [],
          price: {
            create: {
              retailPrice: 0,
              listA: 5000.0,
              listB: 4800.0,
              listC: 4500.0,
              listD: 4200.0,
              minB2BOrderQty: 1,
            },
          },
          inventory: {
            create: {
              totalStock: 50,
            },
          },
        },
      },
    },
  });

  console.log("Products and Variants created.");

  // 5. Cart Discount Tiers
  await prisma.cartDiscountTier.createMany({
    data: [
      { minAmount: 10000, discountPercent: 3, label: "Gümüş İndirim", platform: Platform.TOPTANBOX },
      { minAmount: 25000, discountPercent: 7, label: "Altın İndirim", platform: Platform.TOPTANBOX },
      { minAmount: 50000, discountPercent: 12, label: "Platin İndirim", platform: Platform.TOPTANBOX },
    ],
    skipDuplicates: true,
  });

  console.log("Seeding completed successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
