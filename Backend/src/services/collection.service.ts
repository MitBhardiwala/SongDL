import { prisma } from "../lib/prisma.js";
import { ApiError } from "../utils/ApiError.js";

/**
 * Adds a song to a user's collection.
 * Throws 404 if the song doesn't exist.
 * Throws 409 if the song is already in the user's collection.
 */
export const addSongToCollection = async (userId: string, songId: string) => {
  // Verify the song exists
  const song = await prisma.song.findUnique({ where: { id: songId } });
  if (!song) {
    throw new ApiError(404, "Song not found");
  }

  // Check for duplicate
  const existing = await prisma.userSong.findUnique({
    where: { userId_songId: { userId, songId } },
  });
  if (existing) {
    throw new ApiError(409, "Song is already in your collection");
  }

  return await prisma.userSong.create({
    data: { userId, songId },
    include: { song: true },
  });
};

/**
 * Removes a song from a user's collection.
 * Throws 404 if the entry is not found.
 */
export const removeSongFromCollection = async (
  userId: string,
  songId: string
) => {
  const entry = await prisma.userSong.findUnique({
    where: { userId_songId: { userId, songId } },
  });

  if (!entry) {
    throw new ApiError(404, "Song not found in your collection");
  }

  return await prisma.userSong.delete({
    where: { userId_songId: { userId, songId } },
  });
};

/**
 * Returns all songs in a user's collection.
 * Response shape matches GET /api/songs — an array of Song objects.
 */
export const getUserCollection = async (userId: string) => {
  const userSongs = await prisma.userSong.findMany({
    where: { userId },
    include: { song: true },
    orderBy: { addedAt: "desc" },
  });

  return userSongs.map((entry) => entry.song);
};
