import { Router } from "express";
import downloadRoutes from "./download.routes.js";
import songsRoutes from "./songs.routes.js";
import collectionRoutes from "./collection.routes.js";
import { requireAuth } from "../middlewares/require-auth.js";

const router = Router();

router.use("/download", downloadRoutes);
router.use("/songs", songsRoutes);
router.use("/collection", requireAuth, collectionRoutes);

export default router;


