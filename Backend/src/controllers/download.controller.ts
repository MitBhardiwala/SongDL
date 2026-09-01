import { Request, Response } from "express";
import { ApiError } from "../utils/ApiError.js";
import { extractVideoId } from "../utils/youtube.util.js";
import { processDownload } from "../services/download.service.js";

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