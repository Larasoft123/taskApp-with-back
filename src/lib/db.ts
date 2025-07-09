import { PrismaClient } from "@prisma/client";
import { PrismaLibSQL } from "@prisma/adapter-libsql";
import {createClient} from "@libsql/client"
import { config } from "@/config";


const dbConfig = {
    url: config.env.TURSO_DATABASE_URL,
    authToken: config.env.TURSO_AUTH_TOKEN,
};

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};


export const libSql = createClient(dbConfig)




const adapter = new PrismaLibSQL(dbConfig);

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter
    
  });


if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;

