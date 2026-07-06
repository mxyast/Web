import { prisma } from "@eticaret/database";
import { Header } from "../../components/Header";
import { Tag, Trash2, Package, ChevronRight } from "lucide-react";
import Link from "next/link";
import { DeleteCategoryButton } from "./DeleteCategoryButton";
import { CategoryForm } from "./CategoryForm";

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    where: { parentId: null },
    orderBy: { sortOrder: "asc" },
    include: {
      _count: {
        select: { products: true }
      },
      children: {
        include: {
          _count: { select: { products: true } }
        }
      }
    }
  });

  const parentCategories = categories.map(cat => ({
    id: cat.id,
    name: cat.name
  }));

  return (
    <>
      <Header title="Kategori Yönetimi" />

      <main className="flex-1 overflow-y-auto p-8 space-y-6">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500 font-medium">{categories.length} ana kategori</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Sol Kolon - Kategori Formu */}
          <div className="lg:col-span-1">
            <CategoryForm parentCategories={parentCategories} />
          </div>

          {/* Sağ Kolon - Kategori Listesi */}
          <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-gray-50">
              <div className="flex items-center gap-2">
                <Tag className="w-5 h-5 text-gray-400" />
                <h2 className="text-sm font-black uppercase tracking-widest text-slate-800">Kategoriler</h2>
              </div>
            </div>

            {categories.length === 0 ? (
              <div className="text-center py-16 text-sm text-gray-400 font-bold">
                Henüz kategori eklenmemiş.
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {categories.map((cat) => (
                  <div key={cat.id}>
                    {/* Ana Kategori */}
                    <div className="flex items-center justify-between px-8 py-5 hover:bg-gray-50/50 transition-colors group">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
                          <Tag className="w-4 h-4 text-slate-500" />
                        </div>
                        <div>
                          <p className="font-bold text-sm text-slate-900">{cat.name}</p>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">/{cat.slug}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500">
                          <Package className="w-3.5 h-3.5" />
                          {cat._count.products + cat.children.reduce((acc, child) => acc + child._count.products, 0)} ürün
                        </div>
                        <DeleteCategoryButton
                          categoryId={cat.id}
                          categoryName={cat.name}
                          productCount={cat._count.products + cat.children.reduce((acc, child) => acc + child._count.products, 0)}
                        />
                      </div>
                    </div>

                    {/* Alt Kategoriler */}
                    {cat.children.map((child) => (
                      <div key={child.id} className="flex items-center justify-between px-8 py-4 bg-gray-50/30 border-t border-gray-50 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center gap-4">
                          <ChevronRight className="w-4 h-4 text-gray-300 ml-5" />
                          <div>
                            <p className="font-bold text-sm text-slate-700">{child.name}</p>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">/{child.slug}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500">
                            <Package className="w-3.5 h-3.5" />
                            {child._count.products} ürün
                          </div>
                          <DeleteCategoryButton
                            categoryId={child.id}
                            categoryName={child.name}
                            productCount={child._count.products}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
