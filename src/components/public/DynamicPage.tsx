import Image from "next/image";
import { Container } from "@/components/shared/Container";

interface Props {
  title: string;
  subtitle: string | null;
  heroImageUrl: string | null;
  content: string;
}

export function DynamicPage({ title, subtitle, heroImageUrl, content }: Props) {
  return (
    <>
      <header className="relative border-b border-border bg-muted/30">
        {heroImageUrl ? (
          <div className="relative h-64 md:h-96 w-full">
            <Image
              src={heroImageUrl}
              alt={title}
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            <Container className="absolute inset-x-0 bottom-6 text-white">
              <h1 className="text-3xl md:text-5xl font-semibold tracking-tight">{title}</h1>
              {subtitle ? (
                <p className="mt-2 text-white/90 max-w-2xl text-base md:text-lg">
                  {subtitle}
                </p>
              ) : null}
            </Container>
          </div>
        ) : (
          <Container className="py-12 md:py-16">
            <h1 className="text-3xl md:text-5xl font-semibold tracking-tight">{title}</h1>
            {subtitle ? (
              <p className="mt-3 text-muted-foreground text-base md:text-lg max-w-2xl">
                {subtitle}
              </p>
            ) : null}
          </Container>
        )}
      </header>
      <Container className="py-10 md:py-14">
        <article
          className="prose-content max-w-3xl"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </Container>
    </>
  );
}
