// api/download.ts
import axios, { AxiosError } from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL;

export const downloadMp3 = async (youtubeUrl: string): Promise<{ blob: Blob; title: string }> => {
    try {
        const { data } = await axios.get<{ title: string; url: string }>(
            `${API_BASE_URL}/api/download`,
            { params: { url: youtubeUrl } }
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