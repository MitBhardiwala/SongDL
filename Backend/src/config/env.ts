import path from "path";

export const PORT = process.env.PORT || 3000;
export const DOWNLOAD_DIR = path.join(import.meta.dirname, "..", "..", "downloads");