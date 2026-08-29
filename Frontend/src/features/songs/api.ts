import axios, { AxiosError } from "axios";
import type { Song } from "./types";

const API_BASE_URL = "http://localhost:3000";

export const fetchSongs = async (): Promise<Song[]> => {
  try {
    const { data } = await axios.get<Song[]>(`${API_BASE_URL}/api/songs`);
    return data;
  } catch (error) {
    if (error instanceof AxiosError && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Failed to fetch songs");
  }
};
