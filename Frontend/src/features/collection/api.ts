import { AxiosError } from "axios";
import type { Song } from "../songs/types";
import { api } from "@/lib/api";

export const fetchCollectionSongs = async (q?: string): Promise<Song[]> => {
  try {
    const { data } = await api.get("/collection", { params: q ? { q } : undefined });
    return data?.data ?? [];
  } catch (error) {
    if (error instanceof AxiosError && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Failed to fetch collection");
  }
};
