import { Router } from "express";
import { get, list } from "../controllers/songs.controller.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import { validate } from "../middlewares/validate.js";
import { listSongsQuerySchema } from "../validators/validations.js";

const router = Router();

router.get("/", validate({ query: listSongsQuerySchema }), asyncHandler(list));
router.get("/:id", asyncHandler(get));

export default router;
