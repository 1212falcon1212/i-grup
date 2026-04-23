import { PageHeader } from "@/components/admin/PageHeader";
import { PostForm } from "@/components/admin/forms/PostForm";

export const metadata = { title: "Yeni Yazı", robots: { index: false } };

export default function NewPostPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Yeni Yazı" description="Yeni bir blog yazısı oluşturun." />
      <PostForm />
    </div>
  );
}
