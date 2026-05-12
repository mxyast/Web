import { prisma } from "@eticaret/database";
import { Header } from "../../../components/Header";
import { ProductForm } from "./ProductForm";

export default async function NewProductPage() {
  const brands = await prisma.brand.findMany();
  const categories = await prisma.category.findMany();

  return (
    <>
      <Header title="Yeni Ürün Ekle" />
      <main className="flex-1 overflow-y-auto p-8">
         <ProductForm brands={brands} categories={categories} />
      </main>
    </>
  );
}
