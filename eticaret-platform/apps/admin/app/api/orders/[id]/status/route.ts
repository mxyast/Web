import { NextResponse } from "next/server";
import { updateOrderStatus } from "@eticaret/database";
import { OrderStatus } from "@prisma/client";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { status } = await req.json();

    
    if (!status || !Object.values(OrderStatus).includes(status)) {
      return NextResponse.json({ success: false, message: "Geçersiz durum." }, { status: 400 });
    }

    const updatedOrder = await updateOrderStatus(id, status as OrderStatus);
    
    return NextResponse.json({
      success: true,
      message: `Sipariş durumu ${status} olarak güncellendi.`,
      data: updatedOrder
    });
  } catch (error: any) {
    console.error("Order Status Update Error:", error);
    return NextResponse.json({
      success: false,
      message: error.message || "Durum güncellenirken bir hata oluştu."
    }, { status: 500 });
  }
}
