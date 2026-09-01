import { AxiosError } from "axios";
import type { Song } from "./types";
import { api } from "@/lib/api";



export const fetchSongs = async (): Promise<Song[]> => {
  try {
    const { data } = await api.get<Song[]>("/songs");
    return data;
  } catch (error) {
    if (error instanceof AxiosError && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Failed to fetch songs");
  }
};