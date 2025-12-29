import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import { connectToSocket } from "./controllers/socketManager.js";
import cors from "cors";
import userRoutes from "./routes/users.routes.js";
import iceRoutes from "./routes/ice.routes.js";
import dotenv from "dotenv";
import prisma from "./db/prisma.js";

dotenv.config();

const app = express();
const server = createServer(app);
const io = connectToSocket(server);

app.set("port", process.env.PORT || 8000);
app.use(cors());
app.use(express.json({ limit: "40kb" }));
app.use(express.urlencoded({ limit: "40kb", extended: true }));

app.use("/api/v1/users", userRoutes);
app.use("/api/v1", iceRoutes);

const start = async () => {
    try {
        // Test Prisma connection
        await prisma.$connect();
        console.log("✅ Connected to Neon PostgreSQL Database");

        server.listen(app.get("port"), () => {
            console.log(`🚀 Server listening on PORT ${app.get("port")}`);
        });
    } catch (error) {
        console.error("❌ Database connection failed:", error);
        process.exit(1);
    }
};

// Graceful shutdown
process.on("SIGINT", async () => {
    await prisma.$disconnect();
    process.exit(0);
});

start();
