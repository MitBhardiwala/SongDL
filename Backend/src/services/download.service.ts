import fs from "fs";
import { prisma } from "../lib/prisma.js";
import { supabase } from "../lib/supabase.js";
import { convertYoutubeToMp3, fetchVideoMetadata, isValidYoutubeUrl } from "../utils/youtube.util.js";
import { ApiError } from "../utils/ApiError.js";
import { addLyricsToMp3, fetchLyrics } from "../utils/lyrics.util.js";

export const streamSong = async (id: string) => {
  const song = await prisma.song.findUnique({ where: { id } });
  if (!song) throw new ApiError(404, "Song not found");

  const response = await fetch(song.storageUrl);
  if (!response.ok)
    throw new ApiError(502, "Failed to fetch file from storage");

  return { stream: response.body, title: song.title };
};

interface DownloadOptions {
  includeLyrics?: boolean;
}

export const processDownload = async (url: string, videoId: string, options: DownloadOptions = {}) => {
  const { includeLyrics = false } = options;
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
      lyrics: includeLyrics
        ? {
            enabled: true,
            found: false,
            embedded: false,
            saved: false,
            message: "Song already exists in library. Lyrics are only fetched for new downloads.",
          }
        : undefined,
    };
  }

  if (!isValidYoutubeUrl(url)) {
    throw new ApiError(400, "Invalid YouTube URL");
  }

  const [metadata, filePath] = await Promise.all([
    fetchVideoMetadata(url),
    convertYoutubeToMp3(url),
  ]);

  let lyricsText: string | null = null;
  let lyricsSidecarPath: string | null = null;
  let lyricsEmbedded = false;
  let lyricsSidecarUploaded = false;

  if (includeLyrics) {
    try {
      lyricsText = await fetchLyrics(metadata.artist, metadata.title);
      if (lyricsText) {
        const result = await addLyricsToMp3(filePath, lyricsText);
        lyricsEmbedded = result.embedded;
        lyricsSidecarPath = result.sidecarPath;
      }
    } catch (error) {
      console.warn("Failed to fetch/process lyrics", error);
    }
  }


  try {
    const buffer = fs.readFileSync(filePath);
    const storagePath = `${videoId}.mp3`;

    await supabase.storage.from("Songs").upload(storagePath, buffer, {
      contentType: "audio/mpeg",
      upsert: true,
    });

    if (lyricsSidecarPath && fs.existsSync(lyricsSidecarPath)) {
      try {
        const sidecarBuffer = fs.readFileSync(lyricsSidecarPath);
        await supabase.storage.from("Songs").upload(`${videoId}.lrc`, sidecarBuffer, {
          contentType: "text/plain; charset=utf-8",
          upsert: true,
        });
        lyricsSidecarUploaded = true;
      } catch (error) {
        console.warn("Failed to upload lyrics sidecar", error);
      }
    }

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

    return {
      ...metadata,
      url: publicUrlData.publicUrl,
      lyrics: includeLyrics
        ? {
            enabled: true,
            found: Boolean(lyricsText),
            embedded: lyricsEmbedded,
            saved: lyricsSidecarUploaded,
            message: lyricsText
              ? undefined
              : "Lyrics not found for this track. Downloaded audio without lyrics.",
          }
        : undefined,
    };

  } finally {
    fs.unlink(filePath, (err) => {
      if (err) console.error(`Failed to delete local file ${filePath}:`, err);
    });
    if (lyricsSidecarPath) {
      fs.unlink(lyricsSidecarPath, (err) => {
        if (err) console.error(`Failed to delete local file ${lyricsSidecarPath}:`, err);
      });
    }
  }
};