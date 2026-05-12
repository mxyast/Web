import { NextResponse } from "next/server";
import { syncInventoryFromExternal } from "@eticaret/database";

export async function POST() {
  try {
    const results = await syncInventoryFromExternal();
    return NextResponse.json({
      success: true,
      message: "Stok senkronizasyonu başarıyla tamamlandı.",
      data: results
    });
  } catch (error) {
    console.error("Sync API Error:", error);
    return NextResponse.json({
      success: false,
      message: "Senkronizasyon sırasında bir hata oluştu."
    }, { status: 500 });
  }
}
