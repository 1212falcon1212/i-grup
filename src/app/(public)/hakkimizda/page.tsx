import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { DynamicPage } from "@/components/public/DynamicPage";

export const revalidate = 3600;

async function getPage() {
  const page = await prisma.page.findUnique({ where: { slug: "hakkimizda" } });
  return page;
}

export async function generateMetadata() {
  const page = await getPage();
  if (!page) return {};
  return {
    title: page.seoTitle ?? page.title,
    description: page.seoDescription ?? page.subtitle ?? undefined,
  };
}

export default async function HakkimizdaPage() {
  const page = await getPage();
  if (!page) notFound();
  return (
    <DynamicPage
      title={page.title}
      subtitle={page.subtitle}
      heroImageUrl={page.heroImageUrl}
      content={page.content}
    />
  );
}
