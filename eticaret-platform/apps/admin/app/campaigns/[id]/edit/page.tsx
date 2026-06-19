import { prisma } from "@eticaret/database";
import { Header } from "../../../../components/Header";
import { CampaignForm } from "../../CampaignForm";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { notFound } from "next/navigation";

export default async function EditCampaignPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const campaign = await prisma.campaign.findUnique({
    where: { id },
    include: { products: { select: { id: true } } }
  });

  if (!campaign) notFound();

  const allProducts = await prisma.product.findMany({
    where: { isActive: true },
    select: { id: true, name: true, brand: { select: { name: true } } },
    orderBy: { name: "asc" }
  });

  return (
    <>
      <Header title="Kampanyayı Düzenle" />

      <main className="flex-1 overflow-y-auto p-8">
        <div className="mb-6 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400">
          <Link href="/campaigns" className="hover:text-slate-800 transition-colors">Kampanyalar</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-slate-800">{campaign.title}</span>
        </div>

        <CampaignForm initialData={campaign} allProducts={allProducts} />
      </main>
    </>
  );
}
