import { prisma } from "@eticaret/database";
import { Header } from "../../components/Header";
import { HomepageSectionManager } from "./HomepageSectionManager";
import { HomepageBannerManager } from "./HomepageBannerManager";

export default async function HomepagePage() {
  const sections = await prisma.homepageSection.findMany({
    orderBy: { sortOrder: "asc" },
    include: { category: true },
  });

  const banner = await prisma.homepageBanner.findFirst();

  const categories = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
  });

  return (
    <>
      <Header title="Ana Sayfa Yönetimi" />
      <main className="flex-1 overflow-y-auto p-8 space-y-8">
        <HomepageBannerManager banner={banner} />
        <HomepageSectionManager sections={sections} categories={categories} />
      </main>
    </>
  );
}
