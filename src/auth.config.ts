import type { NextAuthConfig } from "next-auth";

export const authConfig: NextAuthConfig = {
  pages: {
    signIn: "/admin/login",
  },
  session: { strategy: "jwt" },
  trustHost: true,
  providers: [],
  callbacks: {
    authorized({ auth, request }) {
      const url = request.nextUrl;
      const isOnAdmin = url.pathname.startsWith("/admin");
      const isLoginPage = url.pathname === "/admin/login";

      if (isOnAdmin && !isLoginPage && !auth) {
        const loginUrl = new URL("/admin/login", url);
        loginUrl.searchParams.set("callbackUrl", url.pathname);
        return Response.redirect(loginUrl);
      }

      if (isLoginPage && auth) {
        return Response.redirect(new URL("/admin", url));
      }

      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: string }).role ?? "admin";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        (session.user as { role?: string }).role = token.role as string;
      }
      return session;
    },
  },
};
