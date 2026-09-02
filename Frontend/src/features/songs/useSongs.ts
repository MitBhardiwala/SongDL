import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { fetchSongs } from "./api";
import type { Song } from "./types";
import { queryKeys } from "@/lib/queryKeys";
import { useDebounce } from "@/hooks/useDebounce";

export function useSongs(query = "") {
  const debouncedQuery = useDebounce(query, 300);

  const { data, isLoading, isFetching, isError, error, refetch } = useQuery<Song[], Error>({
    queryKey: queryKeys.songs(debouncedQuery),
    queryFn: () => fetchSongs(debouncedQuery || undefined),
    placeholderData: keepPreviousData,
  });

  return {
    songs: data ?? [],
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  };
}
