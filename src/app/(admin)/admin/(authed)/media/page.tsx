import { prisma } from "@/lib/db";
import { MediaClient } from "./MediaClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Medya",
  robots: { index: false, follow: false },
};

export default async function MediaPage() {
  const items = await prisma.media.findMany({ orderBy: { createdAt: "desc" } });
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl md:text-3xl font-semibold">Medya</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Sitede kullanılan tüm görseller. Yeni görsel yüklemek için aşağıdaki butonu kullanın.
        </p>
      </header>
      <MediaClient
        initialItems={items.map((m) => ({
          id: m.id,
          path: m.path,
          filename: m.filename,
          alt: m.alt,
          width: m.width,
          height: m.height,
          size: m.size,
          createdAt: m.createdAt.toISOString(),
        }))}
      />
    </div>
  );
}
