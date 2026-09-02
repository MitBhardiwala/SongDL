import { Router } from "express";
import {
  add,
  list,
  remove,
} from "../controllers/collection.controller.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import { validate } from "../middlewares/validate.js";
import {
  addToCollectionBodySchema,
  listCollectionQuerySchema,
  removeFromCollectionParamsSchema,
} from "../validators/validations.js";

const router = Router();

// GET /api/collection — list all songs in the user's collection
router.get(
  "/",
  validate({ query: listCollectionQuerySchema }),
  asyncHandler(list)
);

// POST /api/collection — add a song to the user's collection
router.post(
  "/",
  validate({ body: addToCollectionBodySchema }),
  asyncHandler(add)
);

// DELETE /api/collection/:songId — remove a song from the user's collection
router.delete(
  "/:songId",
  validate({ params: removeFromCollectionParamsSchema }),
  asyncHandler(remove)
);

export default router;
