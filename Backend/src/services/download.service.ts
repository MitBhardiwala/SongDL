import fs from "fs";
import { prisma } from "../lib/prisma.js";
import { supabase } from "../lib/supabase.js";
import { convertYoutubeToMp3, fetchVideoMetadata, isValidYoutubeUrl } from "../utils/youtube.util.js";
import { ApiError } from "../utils/ApiError.js";

export const processDownload = async (url: string, videoId: string) => {
  const existing = await prisma.song.findUnique({ where: { videoId } });

  if (existing) {
    prisma.song
      .update({ where: { videoId }, data: { lastAccessed: new Date() } })
      .catch((e) => console.error(e));

    return {
      title: existing.title,
      artist: existing.artist,
      duration: existing.duration,
      thumbnailUrl: existing.thumbnailUrl,
      url: existing.storageUrl,
    };
  }

  if (!isValidYoutubeUrl(url)) {
    throw new ApiError(400, "Invalid YouTube URL");
  }

  const [metadata, filePath] = await Promise.all([
    fetchVideoMetadata(url),
    convertYoutubeToMp3(url),
  ]);


  try {
    const buffer = fs.readFileSync(filePath);
    const storagePath = `${videoId}.mp3`;

    await supabase.storage.from("Songs").upload(storagePath, buffer, {
      contentType: "audio/mpeg",
      upsert: true,
    });

    const { data: publicUrlData } = supabase.storage.from("Songs").getPublicUrl(storagePath);

    await prisma.song.create({
      data: {
        videoId,
        title: metadata.title,
        artist: metadata.artist,
        duration: metadata.duration,
        thumbnailUrl: metadata.thumbnailUrl,
        storageUrl: publicUrlData.publicUrl,
        size: buffer.length,
      },
    });

    return { ...metadata, url: publicUrlData.publicUrl };

  } finally {
    fs.unlink(filePath, (err) => {
      if (err) console.error(`Failed to delete local file ${filePath}:`, err);
    });
  }
};