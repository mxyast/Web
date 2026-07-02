import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  const { filename } = await params;

  try {
    // Güvenlik: Path traversal (dizin aşımı) engelleme
    if (filename.includes("..") || path.isAbsolute(filename)) {
      return new NextResponse("Geçersiz dosya adı.", { status: 400 });
    }

    const filePath = path.join(process.cwd(), "public", "uploads", filename);
    const fileBuffer = await readFile(filePath);

    // Dosya uzantısına göre MIME type belirleme
    const ext = path.extname(filename).toLowerCase();
    let contentType = "application/octet-stream";
    if (ext === ".jpg" || ext === ".jpeg") contentType = "image/jpeg";
    else if (ext === ".png") contentType = "image/png";
    else if (ext === ".webp") contentType = "image/webp";
    else if (ext === ".gif") contentType = "image/gif";
    else if (ext === ".svg") contentType = "image/svg+xml";

    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400", // 1 günlük tarayıcı önbelleği
      },
    });
  } catch (error) {
    return new NextResponse("Dosya bulunamadı.", { status: 404 });
  }
}
