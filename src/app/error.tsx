"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="min-h-[70vh] flex items-center justify-center p-6">
      <div className="text-center max-w-md">
        <div className="text-6xl md:text-8xl font-bold text-destructive leading-none">
          !
        </div>
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight mt-4">
          Bir hata oluştu
        </h1>
        <p className="text-muted-foreground mt-2">
          Üzgünüz, sayfa yüklenirken beklenmedik bir sorun yaşandı.
        </p>
        <div className="flex gap-3 justify-center mt-6">
          <Button onClick={reset}>Yeniden dene</Button>
          <Button asChild variant="outline">
            <a href="/">Ana Sayfa</a>
          </Button>
        </div>
      </div>
    </main>
  );
}
