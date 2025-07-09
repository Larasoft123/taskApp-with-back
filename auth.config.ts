// auth.config.ts
import Google from "@auth/core/providers/google";
import { defineConfig } from "auth-astro";
import { config } from "@/config";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@/lib/db";

export default defineConfig({
  adapter: PrismaAdapter(db),

  secret: config.env.AUTH_SECRET,
  providers: [
    Google({
      clientId: config.env.GOGGLE_CLIENT_ID,
      clientSecret: config.env.GOGGLE_CLIENT_SECRET,
    }),
  ],

  cookies: {},

  session: {
    strategy: "jwt",
    },
  pages: {
    signIn: "/auth",
    error: "/auth/error",
  },
  theme: {
    colorScheme: "dark",
  },
  callbacks: {
	
    jwt: async (params) => {
		console.log("jwt ",params)
		
		return {}

	},

	signIn: async (params) => {
		console.log("sigin ",params)
		return true
	},

	session: async (params) => {
		console.log("session ",params)


		return params.session
	}


  },

  events: {},
});
