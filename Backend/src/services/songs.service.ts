import { prisma } from "../lib/prisma.js";
import { ApiError } from "../utils/ApiError.js";

/**
 * Retrieves all songs, ordered by creation date (newest first).
 */
export const getAllSongs = async () => {
  return await prisma.song.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
};

/**
 * Retrieves a single song by its ID. Throws 404 ApiError if not found.
 */
export const getSongById = async (id: string) => {
  const song = await prisma.song.findUnique({
    where: { id },
  });

  if (!song) {
    throw new ApiError(404, "Song not found");
  }

  return song;
};
