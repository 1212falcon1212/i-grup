import { redirect } from "next/navigation";

export default async function ProjectDetailRedirect({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  redirect(`/markalarimiz/${slug}`);
}
