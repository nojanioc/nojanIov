import { login } from "@/api/user";
import nextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = nextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "email", type: "text" },
        password: { label: "password", type: "password" },
      },
      session: {
        strategy: "jwt",
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
  },
  pages: {
    signIn: "/login",
    signOut: "/login",
    error: "/error",
  },
});

export default handler;
