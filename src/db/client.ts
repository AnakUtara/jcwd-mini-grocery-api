import { DB_URL } from "../configs/env.config.ts";
import { PrismaClient } from "../generated/prisma/client.ts";
import { PrismaNeon } from "@prisma/adapter-neon";

const adapter = new PrismaNeon({ connectionString: DB_URL });
const prisma = new PrismaClient({ adapter });

export default prisma;
