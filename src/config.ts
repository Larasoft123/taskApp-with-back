export const config = {
    db: {
        url: import.meta.env.TURSO_DATABASE_URL,
        token: import.meta.env.TURSO_AUTH_TOKEN


    }

} as const