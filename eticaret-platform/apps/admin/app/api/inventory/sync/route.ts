import { NextResponse } from "next/server";
import { syncInventoryFromExternal } from "@eticaret/database";
import { checkAdminAccess } from "../../../../auth";

export async function POST() {
  try {
    await checkAdminAccess();
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
