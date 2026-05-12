"use client";

import { Users, ShoppingCart, BarChart3, Package } from "lucide-react";
import { Header } from "../components/Header";

export default function AdminDashboard() {
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
            <p className="text-2xl font-bold text-gray-800">124.500 ₺</p>
            <div className="mt-2 flex items-center text-sm">
              <span className="text-green-500 font-medium">+12%</span>
              <span className="text-gray-400 ml-2">geçen haftaya göre</span>
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
            <p className="text-2xl font-bold text-gray-800">450.000 ₺</p>
            <div className="mt-2 flex items-center text-sm">
              <span className="text-green-500 font-medium">+5%</span>
              <span className="text-gray-400 ml-2">geçen haftaya göre</span>
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
            <p className="text-2xl font-bold text-gray-800">42</p>
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
            <p className="text-2xl font-bold text-gray-800">5</p>
            <div className="mt-2 flex items-center text-sm">
              <span className="text-purple-600 font-medium text-xs">Evrak onayı bekleniyor</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Orders Table Placeholder */}
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
                  <tr className="border-b border-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-800">#ORD-001</td>
                    <td className="px-4 py-3"><span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-1 rounded">TYPEC</span></td>
                    <td className="px-4 py-3">Ahmet Yılmaz</td>
                    <td className="px-4 py-3 font-medium">1.249,00 ₺</td>
                    <td className="px-4 py-3"><span className="text-yellow-600 font-medium">Hazırlanıyor</span></td>
                  </tr>
                  <tr className="border-b border-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-800">#ORD-002</td>
                    <td className="px-4 py-3"><span className="bg-orange-100 text-orange-800 text-[10px] font-bold px-2 py-1 rounded">TOPTANBOX</span></td>
                    <td className="px-4 py-3">ABC Teknoloji Ltd.</td>
                    <td className="px-4 py-3 font-medium">24.500,00 ₺</td>
                    <td className="px-4 py-3"><span className="text-blue-600 font-medium">Onay Bekliyor</span></td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium text-gray-800">#ORD-003</td>
                    <td className="px-4 py-3"><span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-1 rounded">TYPEC</span></td>
                    <td className="px-4 py-3">Mehmet Demir</td>
                    <td className="px-4 py-3 font-medium">450,00 ₺</td>
                    <td className="px-4 py-3"><span className="text-green-600 font-medium">Kargolandı</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Smart Stock Shield Warnings Placeholder */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-800">Kritik Stok Uyarıları</h2>
              <span className="text-xs font-bold bg-red-100 text-red-600 px-2 py-1 rounded">B2C Koruması</span>
            </div>
            <div className="space-y-4">
              <div className="p-4 border border-red-100 bg-red-50 rounded-lg flex items-start gap-4">
                <div className="p-2 bg-red-100 text-red-600 rounded mt-0.5">
                  <Package className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-red-800 mb-1">Baseus GaN5 Pro 100W (SKU: BS-100W-B)</h4>
                  <p className="text-xs text-red-600">
                    TypeC için ayrılan %20'lik koruma havuzu sınırına yaklaşıldı. Fiziksel stok kritik seviyede.
                  </p>
                  <div className="mt-2 text-xs font-medium text-red-800">
                    Kalan B2C Stoku: 12 Adet | Toptan Alım Durduruldu
                  </div>
                </div>
              </div>
              
              <div className="p-4 border border-yellow-100 bg-yellow-50 rounded-lg flex items-start gap-4">
                <div className="p-2 bg-yellow-100 text-yellow-600 rounded mt-0.5">
                  <Package className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-yellow-800 mb-1">Ugreen 65W Hub (SKU: UG-65W-H)</h4>
                  <p className="text-xs text-yellow-600">
                    ToptanBox üzerinden yüksek hacimli bir sipariş (150 adet) B2C rezervasyonunu etkilemek üzere.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
