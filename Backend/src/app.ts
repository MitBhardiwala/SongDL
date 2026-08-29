// server.ts
import express, { Request, Response } from "express";
import { errorHandler } from "./middlewares/error.middleware.js";
import apiRoutes from "./routes/index.js";
import cors from 'cors';
import { toNodeHandler } from "better-auth/node";
import { auth } from './lib/auth.js';
import { requireAuth } from "./middlewares/require-auth.js";

const app = express();

app.use(
    cors({
        origin: [
            "http://localhost:5173",
            "https://songdl-frontend.onrender.com",
        ],
        credentials: true,
    })
);

// Better Auth handler MUST come before express.json()
app.all("/api/auth/{*any}", toNodeHandler(auth));

// json middleware AFTER the auth handler, for everything else
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
    return res.status(200).json({
        message: "Server is running properly"
    })
})

app.use("/api", apiRoutes);

app.get('/api/me', requireAuth, (req, res) => {
    res.json({ user: req.user });
});

app.use((req, res) => {
    res.status(404).json({ success: false, message: "Route not found" });
});

app.use(errorHandler);

export default app;