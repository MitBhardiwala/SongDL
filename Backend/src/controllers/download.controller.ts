import { Request, Response } from "express";
import { Readable } from "stream";
import { ApiError } from "../utils/ApiError.js";
import { extractVideoId } from "../utils/youtube.util.js";
import { processDownload, streamSong } from "../services/download.service.js";


export const downloadMp3 = async (req: Request, res: Response) => {
    const { url } = req.query;

    if (!url || typeof url !== "string") {
        throw new ApiError(400, "Query parameter 'url' is required");
    }

    const videoId = extractVideoId(url);
    if (!videoId) {
        throw new ApiError(400, "Invalid YouTube URL");
    }

    const result = await processDownload(url, videoId);

    return res.json(result);
};

export const streamSongById = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { stream, title } = await streamSong(id as string);

    // Sanitise title for use as a filename
    const safeTitle = title.replace(/[^\w\s\-]/g, "_").trim();

    res.setHeader("Content-Type", "audio/mpeg");
    res.setHeader(
        "Content-Disposition",
        `attachment; filename="${safeTitle}.mp3"`
    );

    Readable.fromWeb(stream as Parameters<typeof Readable.fromWeb>[0]).pipe(res);
};