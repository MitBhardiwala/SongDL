import { useMutation, useQuery, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { toast } from "sonner";
import type { Song } from "../songs/types";
import { queryKeys } from "@/lib/queryKeys";
import { fetchCollectionSongs } from "./api";
import { useDebounce } from "@/hooks/useDebounce";


export function useCollection(query = "") {
  const queryClient = useQueryClient();
  const debouncedQuery = useDebounce(query, 300);

  // ── Fetch ────────────────────────────────────────────────────────────────────
  const { data, isLoading, isFetching, isError, refetch } = useQuery<Song[], Error>({
    queryKey: queryKeys.collection(debouncedQuery),
    queryFn: () => fetchCollectionSongs(debouncedQuery || undefined),
    placeholderData: keepPreviousData,
  });

  // ── Add ──────────────────────────────────────────────────────────────────────
  const { mutateAsync: addSong } = useMutation({
    mutationKey: queryKeys.mutations.addToCollection,
    mutationFn: async (songId: string) => {
      const response = await api.post("/collection", { songId });
      return response.data;
    },
    onSuccess: async (data) => {
      if (data.success) {
        toast.success(data.message || "Song added to collection", {
          description: "You can find it in My Collection",
          duration: 4000,
        });
        await queryClient.invalidateQueries({ queryKey: ["collection"] });
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "An error occurred", { duration: 4000 });
    },
  });

  // ── Remove ───────────────────────────────────────────────────────────────────
  const { mutateAsync: removeSong } = useMutation({
    mutationKey: queryKeys.mutations.removeFromCollection,
    mutationFn: async (songId: string) => {
      const response = await api.delete(`/collection/${songId}`);
      return response.data;
    },
    onSuccess: async (data) => {
      toast.success(data.message || "Song removed from collection", {
        description: "The song has been removed from My Collection",
        duration: 4000,
      });
      await queryClient.invalidateQueries({ queryKey: ["collection"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "An error occurred", { duration: 4000 });
    },
  });

  return {
    songs: data ?? [],
    isLoading,
    isFetching,
    isError,
    refetch,
    addSong,
    removeSong,
  };
}
