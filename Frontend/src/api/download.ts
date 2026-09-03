// api/download.ts
import { API_BASE_URL } from "@/lib/utils";
import axios, { AxiosError } from "axios";


interface DownloadRequest {
    youtubeUrl: string;
    includeLyrics: boolean;
}

export const downloadMp3 = async ({ youtubeUrl, includeLyrics }: DownloadRequest): Promise<{ blob: Blob; title: string }> => {
    try {
        const { data } = await axios.get<{ title: string; url: string }>(
            `${API_BASE_URL}/api/download`,
            { params: { url: youtubeUrl, lyrics: includeLyrics } }
        );

        const fileResponse = await axios.get(data.url, {
            responseType: "blob",
        });

        return { blob: fileResponse.data, title: data.title };
    } catch (error) {
        if (error instanceof AxiosError && error.response?.data?.message) {
            throw new Error(error.response.data.message);
        }

        throw new Error("Failed to download mp3");
    }
};