import { z } from "zod";

// ─── Songs ────────────────────────────────────────────────────────────────────

/**
 * Schema for GET /songs query params.
 * Accepts an optional search query string.
 */
export const listSongsQuerySchema = z.object({
  q: z.string().trim().optional(),
});

// ─── Collection ───────────────────────────────────────────────────────────────

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
 * Accepts an optional search query string.
 */
export const listCollectionQuerySchema = z.object({
  q: z.string().trim().optional(),
});
