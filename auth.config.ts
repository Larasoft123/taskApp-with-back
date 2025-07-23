// auth.config.ts
import Google from "@auth/core/providers/google";
import { defineConfig } from "auth-astro";
import { config } from "@/config";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@/lib/db";
import { getUserById } from "@/utils/auth/user";



export default defineConfig({
  adapter: PrismaAdapter(db),

  secret: config.env.AUTH_SECRET,
  providers: [
    Google({
      clientId: config.env.GOOGLE_CLIENT_ID,
      clientSecret: config.env.GOOGLE_CLIENT_SECRET,
    }),
  ],

  
  

  session: {
    strategy: "jwt",
  },

  pages: {
    error: "/auth/error",
    signIn: "/auth"

  },
  theme: {
    colorScheme: "dark",
  },
  callbacks: {
    jwt: async ({ token }) => {
      if (!token.sub) return token;

 
      const user = await getUserById(token.sub);
      if (!user) return token;

      
      token.name = user.name;
      token.email = user.email;
      token.picture = user.image;

      return token;
    },

    signIn: async (params) => {
      return true;
    },

    session: async ({ token, session, user }) => {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }

      return session;
    },
  },


});
