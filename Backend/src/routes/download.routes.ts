import { Router } from "express";
import { downloadMp3, streamSongById } from "../controllers/download.controller.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";

const router = Router();

router.get("/", asyncHandler(downloadMp3));
router.get("/song/:id", asyncHandler(streamSongById));

export default router;