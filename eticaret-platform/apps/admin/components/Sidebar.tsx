"use client";

import { LayoutDashboard, Users, Package, ShoppingCart, FileText, Settings, BarChart3, CreditCard, PlusCircle, Megaphone, Tag, LayoutTemplate, Shield, LogOut, ClipboardList } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

const menuItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard, category: null },
  { href: "/products", label: "Ürün Yönetimi", icon: Package, category: "E-Ticaret" },
  { href: "/categories", label: "Kategoriler", icon: Tag, category: "E-Ticaret" },
  { href: "/campaigns", label: "Kampanyalar", icon: Megaphone, category: "E-Ticaret" },
  { href: "/orders", label: "Siparişler", icon: ShoppingCart, category: "E-Ticaret" },
  { href: "/payments", label: "Ödemeler", icon: CreditCard, category: "E-Ticaret" },
  { href: "/homepage", label: "Ana Sayfa Yönetimi", icon: LayoutTemplate, category: "İçerik" },
  { href: "/dealers", label: "Bayi Yönetimi", icon: Users, category: "B2B (ToptanBox)" },
  { href: "/orders/new", label: "Sipariş Girişi", icon: PlusCircle, category: "B2B (ToptanBox)" },
  { href: "/catalogs", label: "Katalog Motoru", icon: FileText, category: "B2B (ToptanBox)" },
  { href: "/users", label: "Kullanıcı Yönetimi", icon: Users, category: "Raporlar & Sistem" },
  { href: "/roles", label: "Rol & Yetki Yönetimi", icon: Shield, category: "Raporlar & Sistem" },
  { href: "/logs", label: "İşlem Logları", icon: ClipboardList, category: "Raporlar & Sistem" },
  { href: "/settings", label: "Sistem Ayarları", icon: Settings, category: "Raporlar & Sistem" },
  { href: "/reports", label: "Satış Analitikleri", icon: BarChart3, category: "Raporlar & Sistem" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-[var(--color-admin-sidebar)] text-[var(--color-admin-sidebar-text)] flex flex-col hidden md:flex shrink-0 border-r border-gray-800">
      <div className="h-16 flex items-center px-6 border-b border-gray-700 bg-gray-900">
        <span className="text-xl font-bold text-white tracking-wide">Admin Paneli</span>
      </div>
      
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-3">
          {menuItems.map((item, idx) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            
            return (
              <div key={item.href}>
                {item.category && (idx === 0 || menuItems[idx - 1]?.category !== item.category) && (
                  <div className="pt-4 pb-2">
                    <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">{item.category}</p>
                  </div>
                )}
                <Link 
                  href={item.href} 
                  className={`flex items-center px-3 py-2.5 rounded-md transition-all group ${
                    isActive 
                      ? "bg-[var(--color-admin-accent)] text-white" 
                      : "hover:bg-[var(--color-admin-sidebar-hover)] hover:text-white"
                  }`}
                >
                  <Icon className={`w-5 h-5 mr-3 ${isActive ? "text-white" : "text-gray-400 group-hover:text-white"}`} />
                  <span className="font-medium">{item.label}</span>
                </Link>
              </div>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
