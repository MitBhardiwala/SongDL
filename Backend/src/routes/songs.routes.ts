import { Router } from "express";
import { get, list } from "../controllers/songs.controller.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";

const router = Router();

router.get("/", asyncHandler(list));
router.get("/:id", asyncHandler(get));

export default router;
