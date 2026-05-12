import { prisma } from "@eticaret/database";
import { Header } from "../../../../components/Header";
import { ProductForm } from "../../new/ProductForm";
import { notFound } from "next/navigation";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      variants: {
        include: {
          inventory: true,
          price: true
        }
      }
    }
  });

  if (!product) {
    notFound();
  }

  const brands = await prisma.brand.findMany();
  const categories = await prisma.category.findMany();

  return (
    <>
      <Header title="Ürün Düzenle" />
      <main className="flex-1 overflow-y-auto p-8">
         <ProductForm brands={brands} categories={categories} product={JSON.parse(JSON.stringify(product))} />
      </main>
    </>
  );
}
