import { SongCard } from "./SongCard";
import type { Song } from "../types";

interface SongGridProps {
  songs: Song[];
  isLoading: boolean;
  isError: boolean;
  activeSong: Song | null;
  isPlaying: boolean;
  onSelect: (song: Song) => void;
  onRetry: () => void;
}

function SkeletonCard() {
  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <div className="aspect-video w-full animate-pulse bg-muted" />
      <div className="flex flex-col gap-2 p-3">
        <div className="h-3.5 w-3/4 animate-pulse rounded bg-muted" />
        <div className="h-3 w-1/2 animate-pulse rounded bg-muted" />
      </div>
    </div>
  );
}

export function SongGrid({
  songs,
  isLoading,
  isError,
  activeSong,
  isPlaying,
  onSelect,
  onRetry,
}: SongGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center gap-4 py-16 text-center">
        <p className="text-muted-foreground">Failed to load songs.</p>
        <button
          id="retry-songs-btn"
          onClick={onRetry}
          className="rounded-lg border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-accent"
        >
          Retry
        </button>
      </div>
    );
  }

  if (songs.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 py-16 text-center">
        <p className="text-muted-foreground">No songs found. Download some first!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {songs.map((song) => (
        <SongCard
          key={song.id}
          song={song}
          isActive={activeSong?.id === song.id}
          isPlaying={activeSong?.id === song.id && isPlaying}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}
