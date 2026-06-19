import { Users, ShoppingCart, BarChart3, Package } from "lucide-react";
import { Header } from "../components/Header";
import { prisma } from "@eticaret/database";

export const revalidate = 0; // Disable static rendering for dashboard to ensure fresh data

export default async function AdminDashboard() {
  // 1. Calculate TypeC (B2C) Revenue
  const typecRevenueRes = await prisma.order.aggregate({
    where: {
      platform: "TYPEC",
      status: {
        in: ["PAID", "PROCESSING", "SHIPPED", "DELIVERED"]
      }
    },
    _sum: {
      totalAmount: true
    }
  });

  // 2. Calculate ToptanBox (B2B) Revenue
  const toptanboxRevenueRes = await prisma.order.aggregate({
    where: {
      platform: "TOPTANBOX",
      status: {
        in: ["PAID", "PROCESSING", "SHIPPED", "DELIVERED", "APPROVED"]
      }
    },
    _sum: {
      totalAmount: true
    }
  });

  const typecRevenue = Number(typecRevenueRes._sum.totalAmount || 0);
  const toptanboxRevenue = Number(toptanboxRevenueRes._sum.totalAmount || 0);

  // 3. Count Pending Orders
  const pendingOrdersCount = await prisma.order.count({
    where: {
      status: {
        in: ["PENDING", "PENDING_APPROVAL"]
      }
    }
  });

  // 4. Count Pending Dealers Awaiting Approval
  const pendingDealersCount = await prisma.b2BProfile.count({
    where: {
      isApproved: false
    }
  });

  // 5. Fetch Recent Orders (B2C & B2B)
  const recentOrders = await prisma.order.findMany({
    take: 8,
    orderBy: {
      createdAt: "desc"
    },
    include: {
      user: {
        select: {
          name: true,
          email: true
        }
      }
    }
  });

  // 6. Fetch Critical Stock Warnings
  const criticalStock = await prisma.inventory.findMany({
    where: {
      totalStock: {
        lt: 20
      }
    },
    include: {
      variant: {
        include: {
          product: {
            select: {
              name: true
            }
          }
        }
      }
    },
    take: 5,
    orderBy: {
      totalStock: "asc"
    }
  });

  // Format helper
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("tr-TR", {
      style: "currency",
      currency: "TRY",
      minimumFractionDigits: 2
    }).format(val);
  };

  return (
    <>
      <Header title="Genel Bakış" />
      
      {/* Page Content */}
      <main className="flex-1 overflow-y-auto bg-[var(--color-admin-bg)] p-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* TypeC Stat */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-500 text-sm font-medium">TypeC (B2C) Ciro</h3>
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                <BarChart3 className="w-5 h-5" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-800">{formatCurrency(typecRevenue)}</p>
            <div className="mt-2 flex items-center text-sm">
              <span className="text-blue-500 font-medium text-xs">Toplam Canlı Satış</span>
            </div>
          </div>

          {/* ToptanBox Stat */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-500 text-sm font-medium">ToptanBox (B2B) Ciro</h3>
              <div className="p-2 bg-orange-50 text-orange-600 rounded-lg">
                <BarChart3 className="w-5 h-5" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-800">{formatCurrency(toptanboxRevenue)}</p>
            <div className="mt-2 flex items-center text-sm">
              <span className="text-orange-500 font-medium text-xs">Onaylanmış Bayi Siparişleri</span>
            </div>
          </div>

          {/* Orders Stat */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-500 text-sm font-medium">Bekleyen Siparişler</h3>
              <div className="p-2 bg-yellow-50 text-yellow-600 rounded-lg">
                <ShoppingCart className="w-5 h-5" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-800">{pendingOrdersCount}</p>
            <div className="mt-2 flex items-center text-sm">
              <span className="text-yellow-600 font-medium text-xs">İşlem Bekliyor</span>
            </div>
          </div>

          {/* Dealers Stat */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-500 text-sm font-medium">Onay Bekleyen Bayi</h3>
              <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-800">{pendingDealersCount}</p>
            <div className="mt-2 flex items-center text-sm">
              <span className="text-purple-600 font-medium text-xs">Evrak Onayı Bekleyenler</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Orders Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Son Siparişler (B2B & B2C)</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-600">
                <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                  <tr>
                    <th className="px-4 py-3 rounded-l-lg">Sipariş No</th>
                    <th className="px-4 py-3">Platform</th>
                    <th className="px-4 py-3">Müşteri</th>
                    <th className="px-4 py-3">Tutar</th>
                    <th className="px-4 py-3 rounded-r-lg">Durum</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-gray-400">
                        Henüz sipariş bulunmuyor.
                      </td>
                    </tr>
                  ) : (
                    recentOrders.map((order) => (
                      <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 font-medium text-gray-800">
                          #{order.id.slice(-6).toUpperCase()}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`text-[10px] font-bold px-2 py-1 rounded ${
                              order.platform === "TYPEC"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-orange-100 text-orange-800"
                            }`}
                          >
                            {order.platform}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-medium text-gray-800">
                          {order.user.name || order.user.email}
                        </td>
                        <td className="px-4 py-3 font-semibold text-gray-900">
                          {formatCurrency(Number(order.totalAmount))}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`font-semibold text-xs ${
                              ["PAID", "DELIVERED", "APPROVED"].includes(order.status)
                                ? "text-green-600"
                                : ["PENDING", "PENDING_APPROVAL"].includes(order.status)
                                ? "text-yellow-600"
                                : "text-gray-500"
                            }`}
                          >
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Smart Stock Shield Warnings */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-800">Kritik Stok Uyarıları</h2>
              <span className="text-xs font-bold bg-red-100 text-red-600 px-2 py-1 rounded">B2C Koruması</span>
            </div>
            <div className="space-y-4">
              {criticalStock.length === 0 ? (
                <p className="text-sm text-gray-400 py-4 text-center">
                  Tüm ürünlerin stok durumları güvenli seviyede.
                </p>
              ) : (
                criticalStock.map((inv) => (
                  <div
                    key={inv.id}
                    className={`p-4 border rounded-lg flex items-start gap-4 ${
                      inv.totalStock <= 5
                        ? "border-red-100 bg-red-50"
                        : "border-yellow-100 bg-yellow-50"
                    }`}
                  >
                    <div
                      className={`p-2 rounded mt-0.5 ${
                        inv.totalStock <= 5
                          ? "bg-red-100 text-red-600"
                          : "bg-yellow-100 text-yellow-600"
                      }`}
                    >
                      <Package className="w-4 h-4" />
                    </div>
                    <div>
                      <h4
                        className={`text-sm font-bold mb-1 ${
                          inv.totalStock <= 5 ? "text-red-800" : "text-yellow-800"
                        }`}
                      >
                        {inv.variant.product.name} ({inv.variant.sku})
                      </h4>
                      <p
                        className={`text-xs ${
                          inv.totalStock <= 5 ? "text-red-600" : "text-yellow-600"
                        }`}
                      >
                        Stok koruma havuzu sınırına yaklaşıldı. Fiziksel stok kritik seviyede.
                      </p>
                      <div
                        className={`mt-2 text-xs font-bold ${
                          inv.totalStock <= 5 ? "text-red-800" : "text-yellow-800"
                        }`}
                      >
                        Toplam Fiziksel Stok: {inv.totalStock} Adet | B2C Rezerv Oranı: %{inv.b2cReserveRatio}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

