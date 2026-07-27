import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnAdmin = nextUrl.pathname.startsWith('/admin');

      if (isOnAdmin) {
        if (isLoggedIn && auth?.user?.role === 'ADMIN') return true;
        return false; // Redirect unauthenticated users to login page
      }
      return true;
    },
    async jwt({ token, user }) {
        if (user) {
            token.role = user.role as string;
            token.id = user.id as string;
        }
        return token;
    },
    async session({ session, token }) {
        if (token) {
            session.user.role = token.role as string;
            session.user.id = token.id as string;
        }
        return session;
    }
  },
  providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;
