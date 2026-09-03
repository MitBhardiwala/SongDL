import fs from "fs";
import path from "path";
import { execFile } from "child_process";
import { promisify } from "util";

const run = promisify(execFile);

const LYRICS_API_URL = "https://lrclib.net/api/search";
const LYRICS_TIMEOUT_MS = 8_000;
const LYRIC_SUFFIX_REGEX =
  /\s*[-–—]\s*(?:\d{4}\s*)?(?:remaster(?:ed)?(?:\s+\d{4})?|live|version|mono|stereo|edit)\b.*$/i;

interface LyricsSearchResult {
  trackName?: string;
  artistName?: string;
  plainLyrics?: string;
  syncedLyrics?: string;
}

interface LyricsCandidate {
  title: string;
  artist: string | null;
}

export interface LyricsProcessingResult {
  lyrics: string | null;
  embedded: boolean;
  sidecarPath: string | null;
}

const normalizeText = (value: string): string => {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
};

const cleanTitle = (title: string): string => {
  const withoutParens = title
    .replace(/\(([^)]*)\)/g, (_, content: string) => {
      if (/(feat|ft|featuring|remaster|live|version|edit|mono|stereo)/i.test(content)) {
        return "";
      }
      return ` (${content})`;
    })
    .replace(/\[([^\]]*)\]/g, (_, content: string) => {
      if (/(feat|ft|featuring|remaster|live|version|edit|mono|stereo)/i.test(content)) {
        return "";
      }
      return ` [${content}]`;
    });

  return withoutParens
    .replace(LYRIC_SUFFIX_REGEX, "")
    .replace(/\s*(?:feat\.?|ft\.?|featuring)\s+.+$/i, "")
    .replace(/\s+/g, " ")
    .trim();
};

const cleanArtist = (artist: string): string => {
  return artist
    .replace(/\s*(?:feat\.?|ft\.?|featuring)\s+.+$/i, "")
    .replace(/\s+/g, " ")
    .trim();
};

const uniqueNonEmpty = (values: Array<string | null | undefined>): string[] => {
  const seen = new Set<string>();
  for (const value of values) {
    if (!value) continue;
    const trimmed = value.trim();
    if (!trimmed) continue;
    seen.add(trimmed);
  }
  return [...seen];
};

const buildCandidates = (artist: string | null, title: string): LyricsCandidate[] => {
  const titleVariants = uniqueNonEmpty([
    title,
    cleanTitle(title),
    cleanTitle(title).split(" - ")[0],
  ]);

  const artistVariants = artist
    ? uniqueNonEmpty([
        artist,
        cleanArtist(artist),
        cleanArtist(artist).split(",")[0],
        cleanArtist(artist).split("&")[0],
      ])
    : [null];

  const candidates: LyricsCandidate[] = [];
  for (const titleVariant of titleVariants) {
    for (const artistVariant of artistVariants) {
      candidates.push({ title: titleVariant, artist: artistVariant ?? null });
    }
  }

  return candidates.slice(0, 8);
};

const scoreLyricsMatch = (
  result: LyricsSearchResult,
  requestedTitle: string,
  requestedArtist: string | null
): number => {
  const titleScore = normalizeText(result.trackName || "") === normalizeText(requestedTitle) ? 2 : 0;
  const artistScore =
    requestedArtist && normalizeText(result.artistName || "") === normalizeText(requestedArtist) ? 2 : 0;
  const hasPlainLyrics = result.plainLyrics ? 1 : 0;
  return titleScore + artistScore + hasPlainLyrics;
};

const fetchLyricsForCandidate = async (
  candidate: LyricsCandidate
): Promise<LyricsSearchResult[] | null> => {
  const url = new URL(LYRICS_API_URL);
  url.searchParams.set("track_name", candidate.title);
  if (candidate.artist) {
    url.searchParams.set("artist_name", candidate.artist);
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), LYRICS_TIMEOUT_MS);

  try {
    const response = await fetch(url.toString(), { signal: controller.signal });
    if (!response.ok) {
      return null;
    }

    const payload = (await response.json()) as LyricsSearchResult[] | LyricsSearchResult;
    if (Array.isArray(payload)) {
      return payload;
    }

    return payload ? [payload] : null;
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
};

export const fetchLyrics = async (artist: string | null, title: string): Promise<string | null> => {
  const candidates = buildCandidates(artist, title);
  for (const candidate of candidates) {
    const results = await fetchLyricsForCandidate(candidate);
    if (!results?.length) continue;

    const ranked = results
      .filter((entry) => entry.plainLyrics || entry.syncedLyrics)
      .sort(
        (a, b) =>
          scoreLyricsMatch(b, candidate.title, candidate.artist) -
          scoreLyricsMatch(a, candidate.title, candidate.artist)
      );

    const best = ranked[0];
    const text = best?.plainLyrics || best?.syncedLyrics || null;
    if (text?.trim()) {
      return text.trim();
    }
  }

  return null;
};

export const addLyricsToMp3 = async (
  filePath: string,
  lyrics: string
): Promise<LyricsProcessingResult> => {
  const sidecarPath = filePath.replace(/\.mp3$/i, ".lrc");
  let embedded = false;
  let saved = false;

  try {
    fs.writeFileSync(sidecarPath, lyrics, "utf8");
    saved = true;
  } catch (error) {
    console.warn("Failed to write lyrics sidecar file", error);
  }

  const tempOutput = path.join(
    path.dirname(filePath),
    `${path.basename(filePath, ".mp3")}.lyrics.mp3`
  );

  try {
    await run("ffmpeg", [
      "-y",
      "-i",
      filePath,
      "-map",
      "0",
      "-codec",
      "copy",
      "-id3v2_version",
      "3",
      "-metadata",
      `lyrics=${lyrics}`,
      tempOutput,
    ]);
    fs.renameSync(tempOutput, filePath);
    embedded = true;
  } catch (error) {
    if (fs.existsSync(tempOutput)) {
      fs.unlinkSync(tempOutput);
    }
    console.warn("Failed to embed lyrics into MP3 metadata", error);
  }

  return {
    lyrics,
    embedded,
    sidecarPath: saved ? sidecarPath : null,
  };
};
