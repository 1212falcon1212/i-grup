import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { saveImage } from "@/lib/uploads";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }

  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.includes("multipart/form-data")) {
    return NextResponse.json(
      { error: "multipart/form-data bekleniyor" },
      { status: 400 }
    );
  }

  const formData = await request.formData();
  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Dosya bulunamadı" }, { status: 400 });
  }

  try {
    const media = await saveImage(file);
    return NextResponse.json({
      id: media.id,
      url: media.path,
      width: media.width,
      height: media.height,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Yükleme başarısız";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
