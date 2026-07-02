// @ts-nocheck
import { PrismaClient, Platform, PriceList } from "@prisma/client";
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
      role: "ADMIN",
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
      role: "DEALER",
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
      role: "CUSTOMER",
      isVerified: true,
    },
  });

  // 2. Create Brands
  const typec = await prisma.brand.upsert({
    where: { slug: "typec" },
    update: {},
    create: { name: "typec", slug: "typec" },
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

  const audio = await prisma.category.upsert({
    where: { slug: "ses-sistemleri" },
    update: {},
    create: { name: "Ses Sistemleri", slug: "ses-sistemleri" },
  });

  const smart = await prisma.category.upsert({
    where: { slug: "akilli-yasam" },
    update: {},
    create: { name: "Akıllı Yaşam", slug: "akilli-yasam" },
  });

  // 4. Create Products
  const p1 = await prisma.product.upsert({
    where: { slug: "typec-powercore-20k" },
    update: {},
    create: {
      name: "typec PowerCore 20K SuperCharge",
      slug: "typec-powercore-20k",
      description: "20.000mAh yüksek kapasiteli, 65W GaN destekli ultra hızlı taşınabilir şarj cihazı. Aynı anda birden fazla cihazı yüksek hızda şarj edebilir, seyahatlerinizde vazgeçilmez bir yol arkadaşıdır.",
      brandId: typec.id,
      categoryId: chargers.id,
      isB2C: true,
      isB2B: true,
      variants: {
        create: [
          {
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
            attributes: {
              create: [
                { key: "Cihaz", value: "typec PowerCore 20K Powerbank" },
                { key: "Kablo", value: "USB-C to USB-C 100W Kablo (1m)" },
                { key: "Taşıma Çantası", value: "Kadife Taşıma Kılıfı" },
                { key: "Belgeler", value: "Kullanma Kılavuzu ve Garanti Belgesi" }
              ]
            }
          },
          {
            sku: "MJ-PWR-20K-BLK",
            color: "Siyah",
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
                totalStock: 150,
                b2cReserveRatio: 30,
              },
            },
            attributes: {
              create: [
                { key: "Cihaz", value: "typec PowerCore 20K Powerbank" },
                { key: "Kablo", value: "USB-C to USB-C 100W Kablo (1m)" },
                { key: "Taşıma Çantası", value: "Kadife Taşıma Kılıfı" },
                { key: "Belgeler", value: "Kullanma Kılavuzu ve Garanti Belgesi" }
              ]
            }
          }
        ]
      },
    },
  });

  const p2 = await prisma.product.upsert({
    where: { slug: "baseus-gan5-pro-100w" },
    update: {},
    create: {
      name: "Baseus GaN5 Pro 100W Hızlı Şarj Cihazı",
      slug: "baseus-gan5-pro-100w",
      description: "Yeni nesil GaN5 Pro teknolojisi ile daha küçük boyutlarda daha yüksek güç çıkışı. 100W ultra hızlı şarj desteği ile dizüstü bilgisayarlarınızı ve akıllı telefonlarınızı aynı anda güvenle şarj edin.",
      brandId: baseus.id,
      categoryId: chargers.id,
      isB2C: true,
      isB2B: true,
      variants: {
        create: [
          {
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
            attributes: {
              create: [
                { key: "Şarj Başlığı", value: "Baseus GaN5 Pro 100W Şarj Aleti" },
                { key: "Kablo", value: "Baseus Type-C'den Type-C'ye 100W Hızlı Şarj Kablosu (1m)" },
                { key: "Kılavuz", value: "Kullanım Kılavuzu" },
                { key: "Garanti Belgesi", value: "Distribütör Onaylı 2 Yıl Garanti Kartı" }
              ]
            }
          },
          {
            sku: "BS-GAN5-100W-WHT",
            color: "Beyaz",
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
                totalStock: 300,
                b2cReserveRatio: 20,
              },
            },
            attributes: {
              create: [
                { key: "Şarj Başlığı", value: "Baseus GaN5 Pro 100W Şarj Aleti" },
                { key: "Kablo", value: "Baseus Type-C'den Type-C'ye 100W Hızlı Şarj Kablosu (1m)" },
                { key: "Kılavuz", value: "Kullanım Kılavuzu" },
                { key: "Garanti Belgesi", value: "Distribütör Onaylı 2 Yıl Garanti Kartı" }
              ]
            }
          }
        ]
      },
    },
  });

  const p3 = await prisma.product.upsert({
    where: { slug: "typec-ultra-link-c" },
    update: {},
    create: {
      name: "typec UltraLink USB-C to USB-C Kablo",
      slug: "typec-ultra-link-c",
      description: "240W Power Delivery (PD) desteği ve 40Gbps veri transfer hızı. Örgülü naylon yapısı ile bükülmelere ve kırılmalara karşı ultra dayanıklı, uzun ömürlü yüksek hızlı kablo.",
      brandId: typec.id,
      categoryId: cables.id,
      isB2C: true,
      isB2B: true,
      variants: {
        create: [
          {
            sku: "MJ-CBL-240W-2M-TIT",
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
            attributes: {
              create: [
                { key: "Kablo", value: "typec UltraLink 240W USB-C Kablosu (2m)" },
                { key: "Aksesuar", value: "Deri Kablo Düzenleyici Cırt Bant" },
                { key: "Belge", value: "Garanti ve Ürün Kataloğu" }
              ]
            }
          },
          {
            sku: "MJ-CBL-240W-2M-GRY",
            sizeLength: "2m",
            color: "Gri",
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
              create: { totalStock: 500, b2cReserveRatio: 50 },
            },
            attributes: {
              create: [
                { key: "Kablo", value: "typec UltraLink 240W USB-C Kablosu (2m)" },
                { key: "Aksesuar", value: "Deri Kablo Düzenleyici Cırt Bant" },
                { key: "Belge", value: "Garanti ve Ürün Kataloğu" }
              ]
            }
          }
        ]
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

  // Create additional mock users for reviews
  const u1 = await prisma.user.upsert({
    where: { email: "zeynep@eticaret.com" },
    update: {},
    create: { email: "zeynep@eticaret.com", name: "Zeynep Yılmaz", passwordHash, role: "CUSTOMER", isVerified: true },
  });

  const u2 = await prisma.user.upsert({
    where: { email: "mehmet@eticaret.com" },
    update: {},
    create: { email: "mehmet@eticaret.com", name: "Mehmet Demir", passwordHash, role: "CUSTOMER", isVerified: true },
  });

  const u3 = await prisma.user.upsert({
    where: { email: "can@eticaret.com" },
    update: {},
    create: { email: "can@eticaret.com", name: "Can Kaya", passwordHash, role: "CUSTOMER", isVerified: true },
  });

  // Create mock reviews
  console.log("Seeding Reviews...");
  await prisma.review.deleteMany(); // Clear existing reviews first
  await prisma.review.create({
    data: {
      productId: p2.id,
      userId: u1.id,
      rating: 5,
      comment: "Baseus kalitesi kendini belli ediyor. 100W çıkış gücü sayesinde MacBook ve iPhone'umu aynı anda en yüksek hızda şarj edebiliyorum. Isınma problemi de hiç yok. Kesinlikle tavsiye ederim.",
      isApproved: true,
    }
  });

  await prisma.review.create({
    data: {
      productId: p2.id,
      userId: u2.id,
      rating: 4,
      comment: "Şarj aleti biraz ağır ama performansına değer. Kutu içeriği çok zengin, 100W Type-C kablosunun da hediye olarak çıkması büyük bir artı. Lojistik de hızlıydı, sipariş ertesi gün teslim edildi.",
      isApproved: true,
    }
  });

  await prisma.review.create({
    data: {
      productId: p1.id,
      userId: u3.id,
      rating: 5,
      comment: "Kapasitesi ve 65W GaN desteği inanılmaz. Hem telefonumu hem de laptopımı şarj edebiliyorum. typec markasının premium hissi her detayda var.",
      isApproved: true,
    }
  });

  await prisma.review.create({
    data: {
      productId: p3.id,
      userId: customer.id,
      rating: 5,
      comment: "Kablo kalitesi şahane, örgülü naylon yapısı çok dayanıklı duruyor. 240W desteği geleceğe yatırım. typec kalitesi.",
      isApproved: true,
    }
  });

  // 5. Cart Discount Tiers
  await prisma.cartDiscountTier.createMany({
    data: [
      { minAmount: 10000, discountPercent: 3, label: "Gümüş İndirim", platform: Platform.TOPTANBOX },
      { minAmount: 25000, discountPercent: 7, label: "Altın İndirim", platform: Platform.TOPTANBOX },
      { minAmount: 50000, discountPercent: 12, label: "Platin İndirim", platform: Platform.TOPTANBOX },
    ],
    skipDuplicates: true,
  });

  // 6. Create Homepage Sections
  await prisma.homepageSection.upsert({
    where: { key: "chargers" },
    update: {},
    create: {
      key: "chargers",
      title: "ŞARJ ÜNİTELERİ",
      categoryId: chargers.id,
      sortOrder: 1,
      isActive: true,
      isDraft: false,
    },
  });

  await prisma.homepageSection.upsert({
    where: { key: "audio" },
    update: {},
    create: {
      key: "audio",
      title: "SES SİSTEMLERİ",
      categoryId: audio.id,
      sortOrder: 2,
      isActive: true,
      isDraft: false,
    },
  });

  await prisma.homepageSection.upsert({
    where: { key: "smart" },
    update: {},
    create: {
      key: "smart",
      title: "AKILLI YAŞAM",
      categoryId: smart.id,
      sortOrder: 3,
      isActive: true,
      isDraft: false,
    },
  });

  // 7. Create Homepage Banner
  const bannerExists = await prisma.homepageBanner.findFirst();
  if (!bannerExists) {
    await prisma.homepageBanner.create({
      data: {
        badge: "BASEUS EXCLUSIVE",
        title: "ŞARJIN GELECEĞİ",
        titleHighlight: "GAn5 PRO.",
        description: "Baseus'un en yeni nesil GaN teknolojisi ile cihazlarınızı %300 daha hızlı ve güvenli şarj edin.",
        buttonText: "LANSMAN ÜRÜNLERİ",
        buttonUrl: "/products?brand=baseus",
        isActive: true,
        isDraft: false,
      },
    });
  }

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
