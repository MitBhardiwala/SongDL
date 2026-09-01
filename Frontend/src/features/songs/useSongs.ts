import { useQuery } from "@tanstack/react-query";
import { fetchSongs } from "./api";
import type { Song } from "./types";
import { queryKeys } from "@/lib/queryKeys";

export function useSongs() {
  const { data, isLoading, isError, error, refetch } = useQuery<Song[], Error>({
    queryKey: queryKeys.songs,
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
