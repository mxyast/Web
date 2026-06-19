import { prisma } from "@eticaret/database";
import { Header } from "../../components/Header";
import Link from "next/link";
import { Plus, Megaphone, Calendar, CheckCircle2, XCircle } from "lucide-react";
import { ToastContainer } from "../../components/Toast";

export default async function CampaignsPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string }>;
}) {
  const { success } = await searchParams;

  const campaigns = await prisma.campaign.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: { products: true }
      }
    }
  });

  return (
    <>
      <Header title="Kampanyalar" />

      <main className="flex-1 overflow-y-auto p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black tracking-tight text-slate-800">Tüm Kampanyalar</h2>
            <p className="text-xs text-gray-500 mt-1 font-medium">B2C platformlarında gösterilecek kampanyaları yönetin.</p>
          </div>
          <Link
            href="/campaigns/new"
            className="bg-[#E31E24] text-white text-xs font-bold px-6 py-2.5 rounded-full hover:bg-red-700 transition-all shadow-lg shadow-red-500/20 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Yeni Kampanya
          </Link>
        </div>

        <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500">Kampanya Adı</th>
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500 text-center">Tarih Aralığı</th>
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500 text-center">Ürün Sayısı</th>
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500 text-center">Durum</th>
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500 text-right">İşlem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {campaigns.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-16 text-sm text-gray-400 font-bold">
                    Henüz hiç kampanya oluşturulmamış.
                  </td>
                </tr>
              )}
              {campaigns.map((campaign) => (
                <tr key={campaign.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center overflow-hidden shrink-0">
                        {campaign.imageUrl ? (
                          <img src={campaign.imageUrl} alt={campaign.title} className="w-full h-full object-cover" />
                        ) : (
                          <Megaphone className="w-6 h-6 text-gray-400" />
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-sm leading-tight mb-1 text-slate-900">{campaign.title}</p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">
                          {campaign.platform}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <div className="flex flex-col items-center justify-center text-xs font-medium text-slate-600 gap-1">
                      <div className="flex items-center gap-1.5"><Calendar className="w-3 h-3 text-gray-400" /> {campaign.startDate.toLocaleDateString("tr-TR")}</div>
                      <div className="flex items-center gap-1.5"><Calendar className="w-3 h-3 text-gray-400" /> {campaign.endDate.toLocaleDateString("tr-TR")}</div>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <span className="text-sm font-black text-slate-700 bg-gray-100 px-3 py-1 rounded-lg">
                      {campaign._count.products}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-center">
                    {campaign.isActive ? (
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 text-green-600 border border-green-100 text-[10px] font-black uppercase tracking-widest">
                        <CheckCircle2 className="w-3 h-3" /> Aktif
                      </div>
                    ) : (
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-50 text-gray-400 border border-gray-200 text-[10px] font-black uppercase tracking-widest">
                        <XCircle className="w-3 h-3" /> Pasif
                      </div>
                    )}
                  </td>
                  <td className="px-8 py-6 text-right">
                    <Link href={`/campaigns/${campaign.id}/edit`} className="text-xs font-bold text-blue-600 hover:underline">Düzenle</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      <ToastContainer successParam={success} />
    </>
  );
}
