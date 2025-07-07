import {createClient} from "@libsql/client"
import { config } from "@/config"

export const db = createClient({
    url: config.db.url,
    authToken: config.db.token,
})

