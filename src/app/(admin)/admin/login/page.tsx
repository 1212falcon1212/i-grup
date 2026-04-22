import { LoginForm } from "./LoginForm";

export const metadata = {
  title: "Yönetici Girişi",
  robots: { index: false, follow: false },
};

type Search = { callbackUrl?: string };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<Search>;
}) {
  const { callbackUrl } = await searchParams;

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40 p-4">
      <div className="w-full max-w-sm bg-background border border-border rounded-xl p-8 shadow-sm">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            i-grup <span className="text-primary">admin</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Yönetici paneline erişmek için giriş yapın.
          </p>
        </div>
        <LoginForm callbackUrl={callbackUrl ?? "/admin"} />
      </div>
    </div>
  );
}
