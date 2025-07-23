export const config = {
    env: {
        TURSO_DATABASE_URL: import.meta.env.TURSO_DATABASE_URL,
        TURSO_AUTH_TOKEN: import.meta.env.TURSO_AUTH_TOKEN,
        GOOGLE_CLIENT_ID: import.meta.env.GOOGLE_CLIENT_ID,
        GOOGLE_CLIENT_SECRET: import.meta.env.GOOGLE_CLIENT_SECRET,
        AUTH_SECRET: import.meta.env.AUTH_SECRET


    }

} as const