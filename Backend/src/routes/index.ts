import { Router } from "express";
import downloadRoutes from "./download.routes.js";
import songsRoutes from "./songs.routes.js";
import { toNodeHandler } from "better-auth/node";
import { auth } from "../lib/auth.js";

const router = Router();

router.use("/download", downloadRoutes);
router.use("/songs", songsRoutes);

export default router;


