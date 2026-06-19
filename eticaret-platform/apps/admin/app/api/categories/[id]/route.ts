import { prisma } from "@eticaret/database";
import { NextResponse } from "next/server";
import { checkAdminAccess } from "../../../../auth";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    await checkAdminAccess();
    // Check for products
    const productCount = await prisma.product.count({ where: { categoryId: id } });
    if (productCount > 0) {
      return NextResponse.json(
        { error: `Bu kategoriye bağlı ${productCount} ürün var. Önce ürünleri taşıyın.` },
        { status: 400 }
      );
    }

    // Check for child categories
    const childCount = await prisma.category.count({ where: { parentId: id } });
    if (childCount > 0) {
      return NextResponse.json(
        { error: `Bu kategorinin ${childCount} alt kategorisi var. Önce alt kategorileri silin.` },
        { status: 400 }
      );
    }

    await prisma.category.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Category delete error:", error);
    return NextResponse.json({ error: "Kategori silinirken bir hata oluştu." }, { status: 500 });
  }
}
