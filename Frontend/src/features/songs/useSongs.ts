import { useQuery } from "@tanstack/react-query";
import { fetchSongs } from "./api";
import type { Song } from "./types";

export function useSongs() {
  const { data, isLoading, isError, error, refetch } = useQuery<Song[], Error>({
    queryKey: ["songs"],
    queryFn: fetchSongs,
  });

  return {
    songs: data ?? [],
    isLoading,
    isError,
    error,
    refetch,
  };
}
