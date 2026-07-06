import { prisma } from "@eticaret/database";
import { NextResponse } from "next/server";
import { checkAdminAccess } from "../../../../auth";
import { logAdminAction } from "../../../utils/audit";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    await checkAdminAccess();
    
    // Check for products
    const productCount = await prisma.product.count({ where: { brandId: id } });
    if (productCount > 0) {
      return NextResponse.json(
        { error: `Bu markaya bağlı ${productCount} ürün var. Önce ürünleri başka bir markaya atayın veya silin.` },
        { status: 400 }
      );
    }

    const brand = await prisma.brand.findUnique({
      where: { id },
      select: { name: true }
    });

    await prisma.brand.delete({ where: { id } });

    if (brand) {
      await logAdminAction("DELETE_BRAND", "Brand", id, `"${brand.name}" isimli marka silindi.`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Brand delete error:", error);
    return NextResponse.json({ error: "Marka silinirken bir hata oluştu." }, { status: 500 });
  }
}
