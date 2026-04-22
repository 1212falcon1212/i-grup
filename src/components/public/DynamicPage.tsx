import Image from "next/image";
import { Container } from "@/components/shared/Container";
import { Reveal } from "@/components/motion/Reveal";
import { GridBackground } from "@/components/motion/GridBackground";

interface Props {
  title: string;
  subtitle: string | null;
  heroImageUrl: string | null;
  content: string;
}

export function DynamicPage({ title, subtitle, heroImageUrl, content }: Props) {
  return (
    <>
      <header className="relative border-b border-border overflow-hidden">
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
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/20" />
            <Container className="absolute inset-x-0 bottom-6 text-white">
              <Reveal>
                <div className="eyebrow text-white/60 mb-3">
                  <span className="num-badge text-white/80">—</span> Kurumsal
                </div>
                <h1 className="text-4xl md:text-6xl font-semibold tracking-[-0.02em] leading-[1.05]">
                  {title}
                </h1>
                {subtitle ? (
                  <p className="mt-3 text-white/85 max-w-2xl text-base md:text-lg">
                    {subtitle}
                  </p>
                ) : null}
              </Reveal>
            </Container>
          </div>
        ) : (
          <div className="relative bg-muted/30">
            <GridBackground />
            <Container className="relative py-20 md:py-28">
              <Reveal>
                <div className="eyebrow mb-4">
                  <span className="num-badge">—</span> Kurumsal
                </div>
                <h1 className="text-4xl md:text-6xl font-semibold tracking-[-0.02em] leading-[1.05]">
                  {title}
                </h1>
                {subtitle ? (
                  <p className="mt-4 text-muted-foreground text-base md:text-lg max-w-2xl">
                    {subtitle}
                  </p>
                ) : null}
              </Reveal>
            </Container>
          </div>
        )}
      </header>
      <Container className="py-14 md:py-20">
        <Reveal>
          <article
            className="prose-content max-w-3xl"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </Reveal>
      </Container>
    </>
  );
}
