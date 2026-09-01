import { z } from "zod";

/**
 * Schema for POST /collection body.
 * Expects a valid Song UUID.
 */
export const addToCollectionBodySchema = z.object({
  songId: z.string().uuid({ message: "songId must be a valid UUID" }),
});

/**
 * Schema for DELETE /collection/:songId route params.
 */
export const removeFromCollectionParamsSchema = z.object({
  songId: z.string().uuid({ message: "songId must be a valid UUID" }),
});

/**
 * Schema for GET /collection query params.
 * Currently empty — ready for future pagination/filter fields.
 */
export const listCollectionQuerySchema = z.object({});
