import pkg from "@prisma/client";
const { PrismaClient } = pkg;
import * as adapterPkg from "@prisma/adapter-pg";
const PrismaPg = adapterPkg.PrismaPg;
import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
    adapter,
});

export default prisma;
