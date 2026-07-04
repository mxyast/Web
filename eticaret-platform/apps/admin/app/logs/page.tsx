import { prisma } from "@eticaret/database";
import { Header } from "../../components/Header";
import { ClipboardList, ShieldAlert, PlusCircle, Pencil, Trash, Settings } from "lucide-react";
import Link from "next/link";

type Tab = "all" | "products" | "categories" | "dealers" | "system";

export default async function LogsPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: Tab }>;
}) {
  const { tab = "all" } = await searchParams;

  let whereClause = {};
  if (tab === "products") {
    whereClause = { action: { in: ["CREATE_PRODUCT", "UPDATE_PRODUCT", "DEACTIVATE_PRODUCT", "ACTIVATE_PRODUCT"] } };
  } else if (tab === "categories") {
    whereClause = { action: { in: ["CREATE_CATEGORY", "DELETE_CATEGORY"] } };
  } else if (tab === "dealers") {
    whereClause = { action: { in: ["CREATE_DEALER", "UPDATE_DEALER"] } };
  } else if (tab === "system") {
    whereClause = { action: { in: ["UPDATE_SETTINGS"] } };
  }

  const logs = await prisma.auditLog.findMany({
    where: whereClause,
    include: {
      user: {
        select: {
          name: true,
          email: true,
        }
      }
    },
    orderBy: { createdAt: "desc" },
    take: 100, // list last 100 logs
  });

  const tabs = [
    { id: "all", label: "Tüm İşlemler" },
    { id: "products", label: "Ürün İşlemleri" },
    { id: "categories", label: "Kategori İşlemleri" },
    { id: "dealers", label: "Bayi İşlemleri" },
    { id: "system", label: "Sistem Ayarları" },
  ];

  const getActionBadge = (action: string) => {
    if (action.startsWith("CREATE_")) {
      return (
        <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-green-50 text-green-600 border border-green-100">
          <PlusCircle className="w-3 h-3" /> Ekleme
        </span>
      );
    }
    if (action.startsWith("UPDATE_") || action.startsWith("ACTIVATE_")) {
      return (
        <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-50 text-blue-600 border border-blue-100">
          <Pencil className="w-3 h-3" /> Güncelleme
        </span>
      );
    }
    if (action.startsWith("DELETE_") || action.startsWith("DEACTIVATE_")) {
      return (
        <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-red-50 text-red-600 border border-red-100">
          <Trash className="w-3 h-3" /> Silme / Kapama
        </span>
      );
    }
    return (
      <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-50 text-amber-600 border border-amber-100">
        <Settings className="w-3 h-3" /> Ayarlar
      </span>
    );
  };

  return (
    <>
      <Header title="İşlem Logları (Audit Log)" />

      <main className="flex-1 overflow-y-auto p-8 space-y-6">
        {/* Navigation Tabs */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 bg-white border border-gray-100 rounded-2xl p-1 shadow-sm overflow-x-auto max-w-full">
            {tabs.map((t) => {
              const isActive = tab === t.id;
              return (
                <Link
                  key={t.id}
                  href={`/logs?tab=${t.id}`}
                  className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    isActive
                      ? "bg-slate-900 text-white shadow-lg shadow-slate-900/20"
                      : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
                  }`}
                >
                  {t.label}
                </Link>
              );
            })}
          </div>
          <span className="text-xs font-bold text-gray-400 shrink-0">Son 100 işlem</span>
        </div>

        {/* Logs Table */}
        <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-gray-50 flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-gray-400" />
            <h2 className="text-sm font-black uppercase tracking-widest text-slate-800">İşlem Geçmişi</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500">Tarih</th>
                  <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500">İşlem Türü</th>
                  <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500">Açıklama</th>
                  <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500">Kullanıcı</th>
                  <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500 text-right">IP Adresi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {logs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-16 text-sm text-gray-400 font-bold">
                      Henüz işlem kaydı bulunmuyor.
                    </td>
                  </tr>
                ) : (
                  logs.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-50/30 transition-colors">
                      <td className="px-8 py-5 text-xs text-gray-400 font-semibold whitespace-nowrap">
                        {new Date(log.createdAt).toLocaleString("tr-TR")}
                      </td>
                      <td className="px-8 py-5 whitespace-nowrap">
                        {getActionBadge(log.action)}
                      </td>
                      <td className="px-8 py-5 text-sm font-medium text-slate-800 max-w-md">
                        {log.description}
                      </td>
                      <td className="px-8 py-5 whitespace-nowrap">
                        {log.user ? (
                          <div>
                            <p className="text-xs font-bold text-slate-900">{log.user.name}</p>
                            <p className="text-[10px] text-gray-400">{log.user.email}</p>
                          </div>
                        ) : (
                          <span className="text-xs font-bold text-gray-400">Anonim</span>
                        )}
                      </td>
                      <td className="px-8 py-5 text-xs text-gray-400 font-bold text-right whitespace-nowrap">
                        {log.ip || "—"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </>
  );
}
