import { execFile } from "child_process";
import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import { DOWNLOAD_DIR } from "../config/env.js";
import { ApiError } from "./ApiError.js";
import { promisify } from "util";

// Matches only single YouTube video URLs:
//   https://www.youtube.com/watch?v=VIDEOID
//   https://youtube.com/watch?v=VIDEOID&t=30s   (extra query params after id are fine)
//   https://youtu.be/VIDEOID
//   https://www.youtube.com/shorts/VIDEOID
// Rejects: playlists, channels, search, embed pages without an id, malformed ids
const YOUTUBE_URL_REGEX =
  /^https?:\/\/(?:www\.)?(?:youtube\.com\/(?:watch\?v=|shorts\/)([\w-]{11})(?:[&?][\w=&%.-]*)?|youtu\.be\/([\w-]{11})(?:\?[\w=&%.-]*)?)$/;

export const isValidYoutubeUrl = (url: string): boolean => {
  return YOUTUBE_URL_REGEX.test(url);
};

const run = promisify(execFile);

export interface ConversionResult {
  filePath: string;
  title: string;
}

export interface VideoMetadata {
  title: string;
  artist: string | null;
  duration: number | null;
  thumbnailUrl: string | null;
}

export const fetchVideoMetadata = async (youtubeUrl: string): Promise<VideoMetadata> => {
  const { stdout } = await run("yt-dlp", [
    "--js-runtimes", "node",
    "--skip-download",
    "--print", "%(title)s",
    "--print", "%(uploader)s",
    "--print", "%(duration)s",
    "--print", "%(thumbnail)s",
    youtubeUrl,
  ]);

  const [title, artist, duration, thumbnailUrl] = stdout.trim().split("\n");

  return {
    title: title || "Unknown",
    artist: artist && artist !== "NA" ? artist : null,
    duration: duration ? Math.round(Number(duration)) : null,
    thumbnailUrl: thumbnailUrl && thumbnailUrl !== "NA" ? thumbnailUrl : null,
  };
};

export const convertYoutubeToMp3 = async (youtubeUrl: string): Promise<string> => {
  const jobId = uuidv4();
  const outputTemplate = path.join(DOWNLOAD_DIR, `${jobId}.%(ext)s`);
  const expectedFile = path.join(DOWNLOAD_DIR, `${jobId}.mp3`);

  await run("yt-dlp", [
    "--js-runtimes", "node",
    "-x", "--audio-format", "mp3", "--audio-quality", "0",
    "--embed-thumbnail",
    "--add-metadata",
    "-o", outputTemplate,
    youtubeUrl,
  ], { timeout: 120_000 });

  if (!fs.existsSync(expectedFile)) {
    throw new ApiError(500, "Conversion completed but file was not found");
  }

  return expectedFile;
};

export const extractVideoId = (url: string): string | null => {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/watch\?v=)([\w-]{11})/);
  return match ? match[1] : null;
};