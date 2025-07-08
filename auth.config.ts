// auth.config.ts
import Google from '@auth/core/providers/google'
import { defineConfig } from 'auth-astro'
import { config } from '@/config'





export default defineConfig({
	providers: [
		Google({
			clientId: config.env.GOGGLE_CLIENT_ID,
			clientSecret: config.env.GOGGLE_CLIENT_SECRET,
		}),
	],
})

