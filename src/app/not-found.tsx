import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="min-h-[70vh] flex items-center justify-center p-6">
      <div className="text-center max-w-md">
        <div className="text-7xl md:text-9xl font-bold text-primary leading-none">
          404
        </div>
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight mt-4">
          Aradığınız sayfa bulunamadı
        </h1>
        <p className="text-muted-foreground mt-2">
          Sayfa taşınmış veya kaldırılmış olabilir. Ana sayfadan devam edebilirsiniz.
        </p>
        <div className="flex gap-3 justify-center mt-6">
          <Button asChild>
            <Link href="/">Ana Sayfaya Dön</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/iletisim">İletişime Geç</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
