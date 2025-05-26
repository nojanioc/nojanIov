import { login } from "@/api/user";
import nextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = nextAuth({
  session: {
    strategy: "jwt",
  },
  // Ensure NextAuth uses the correct URL from environment
  ...(process.env.NEXTAUTH_URL && { url: process.env.NEXTAUTH_URL }),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "email", type: "text" },
        password: { label: "password", type: "password" },
      },

      //@ts-ignore
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          return;
        }
        try {
          //@ts-ignore
          const user = await login({
            email: credentials?.email,
            password: credentials?.password,
          });

          //@ts-ignore
          return { token: user.data.token, email: user.data.username };
        } catch (e) {
          //@ts-ignore
          throw new Error(e.response.data.message);
        }
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user }: any) => {
      user && (token.user = user);
      return Promise.resolve(token);
    },
    session: async ({ session, token }: any) => {
      session.user = token.user;
      return Promise.resolve(session);
    },
    redirect: async ({ url, baseUrl }: any) => {
      // Ensure redirects always use the correct base URL
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      if (new URL(url).origin === baseUrl) return url;
      return baseUrl + "/login";
    },
  },
  pages: {
    signIn: "/login",
    signOut: "/login",
    error: "/error",
  },
});

export default handler;
