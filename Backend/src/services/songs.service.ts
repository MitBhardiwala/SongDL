import { prisma } from "../lib/prisma.js";
import { ApiError } from "../utils/ApiError.js";

/**
 * Retrieves all songs, ordered by creation date (newest first).
 * Optionally filters by a search query matched against title and artist.
 */
export const getAllSongs = async (query?: string) => {
  return await prisma.song.findMany({
    where: query
      ? {
          OR: [
            { title: { contains: query, mode: "insensitive" } },
            { artist: { contains: query, mode: "insensitive" } },
          ],
        }
      : undefined,
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
