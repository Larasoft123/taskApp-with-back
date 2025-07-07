// auth.config.ts
import Goggle from '@auth/core/providers/google'
import { defineConfig } from 'auth-astro'

export default defineConfig({
	providers: [
		Goggle({
			clientId: import.meta.env.GOGGLE_CLIENT_ID,
			clientSecret: import.meta.env.GOGGLE_CLIENT_SECRET,
		}),
	],
})