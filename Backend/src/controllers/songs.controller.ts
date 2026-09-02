import { Request, Response } from "express";
import { ApiError } from "../utils/ApiError.js";
import * as songsService from "../services/songs.service.js";

/**
 * Controller to list all songs.
 */
export const list = async (req: Request, res: Response) => {
  const { q } = req.validatedQuery as { q?: string };
  const songs = await songsService.getAllSongs(q);
  return res.json({ success: true, message: "Songs listed successfully", data: songs });
};

/**
 * Controller to get a single song's details.
 */
export const get = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id || typeof id !== "string") {
    throw new ApiError(400, "Song ID is required and must be a string");
  }

  const song = await songsService.getSongById(id);
  return res.json({ success: true, message: "Song retrieved successfully", data: song });
};
