import { useMutation, useQuery, useQueryClient, useIsMutating } from "@tanstack/react-query";
import { api } from "../../lib/api";
import { toast } from "sonner";
import type { Song } from "./types";
import { queryKeys } from "../../lib/queryKeys";

export function useCollection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: queryKeys.mutations.addToCollection,
    mutationFn: async (songId: string) => {
      const response = await api.post("/collection", { songId });
      return response.data;
    },
    onSuccess: (data) => {
      if (data.success) {
        toast.success(data.message || "Song added to collection", {
          description: "You can find it in My Collection",
          duration: 4000,
        });
        queryClient.invalidateQueries({ queryKey: queryKeys.collection });
      } else {
        toast.error(data.message || "Failed to add song", {
          description: "Please try again",
          duration: 4000,
        });
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "An error occurred", {
        description: "Something went wrong. Please try again",
        duration: 4000,
      });
    },
  });
}

export function useCollectionSongs() {
  const isRemoving = useIsMutating({ mutationKey: queryKeys.mutations.removeFromCollection });
  const { data, isLoading, isFetching, isError, refetch } = useQuery<Song[], Error>({
    queryKey: queryKeys.collection,
    queryFn: async () => {
      const response = await api.get("/collection");
      return response.data?.data ?? [];
    },
  });

  return {
    songs: data ?? [],
    isLoading: isLoading || isFetching || isRemoving > 0,
    isError,
    refetch,
  };
}

export function useRemoveFromCollection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: queryKeys.mutations.removeFromCollection,
    mutationFn: async (songId: string) => {
      const response = await api.delete(`/collection/${songId}`);
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data.message || "Song removed from collection", {
        description: "The song has been removed from My Collection",
        duration: 4000,
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.collection });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "An error occurred", {
        description: "Something went wrong. Please try again",
        duration: 4000,
      });
    },
  });
}
