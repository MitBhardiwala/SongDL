import { Request, Response } from "express";
import * as collectionService from "../services/collection.service.js";

/**
 * POST /api/collection
 * Adds a song to the authenticated user's collection.
 */
export const add = async (req: Request, res: Response) => {
  const { songId } = req.validatedBody as { songId: string };
  const userId = req.user!.id;

  const entry = await collectionService.addSongToCollection(userId, songId);
  return res.status(201).json({ success: true, message: "Song added to collection", data: entry });
};

/**
 * GET /api/collection
 * Lists all songs in the authenticated user's collection.
 * Response shape matches GET /api/songs — array of Song objects.
 */
export const list = async (req: Request, res: Response) => {
  const userId = req.user!.id;

  const songs = await collectionService.getUserCollection(userId);
  return res.json({ success: true, message: "Songs listed successfully", data: songs });
};

/**
 * DELETE /api/collection/:songId
 * Removes a song from the authenticated user's collection.
 */
export const remove = async (req: Request, res: Response) => {
  const { songId } = req.validatedParams as { songId: string };
  const userId = req.user!.id;

  await collectionService.removeSongFromCollection(userId, songId);
  return res.status(200).json({ success: true, message: "Song removed from collection" });
};
