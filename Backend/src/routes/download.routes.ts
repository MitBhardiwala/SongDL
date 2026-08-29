import { Router } from "express";
import { downloadMp3 } from "../controllers/download.controller.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";

const router = Router();

router.get("/", asyncHandler(downloadMp3));

export default router;