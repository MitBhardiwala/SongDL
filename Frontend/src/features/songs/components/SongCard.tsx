import { Play, Pause } from "lucide-react";
import type { Song } from "../types";
import { formatDuration } from "../utils";

interface SongCardProps {
  song: Song;
  isPlaying: boolean;
  isActive: boolean;
  onSelect: (song: Song) => void;
}

export function SongCard({ song, isPlaying, isActive, onSelect }: SongCardProps) {
  return (
    <div
      id={`song-card-${song.id}`}
      role="button"
      tabIndex={0}
      aria-label={`Play ${song.title}`}
      onClick={() => onSelect(song)}
      onKeyDown={(e) => e.key === "Enter" && onSelect(song)}
      className={`
        group relative flex cursor-pointer flex-col overflow-hidden rounded-xl border bg-card text-card-foreground
        shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md
        ${isActive ? "border-primary ring-1 ring-primary/50" : "border-border"}
      `}
    >
      {/* Thumbnail */}
      <div className="relative aspect-video w-full overflow-hidden bg-muted">
        <img
          src={song.thumbnailUrl}
          alt={song.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src =
              "https://placehold.co/320x180/1a1a1a/555?text=No+Image";
          }}
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/30 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />

        {/* Play/Pause icon (center overlay) */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 shadow-lg">
            {isActive && isPlaying ? (
              <Pause className="h-5 w-5 text-black" />
            ) : (
              <Play className="h-5 w-5 translate-x-0.5 text-black" />
            )}
          </div>
        </div>

        {/* Now playing badge */}
        {isActive && (
          <div className="absolute top-2 left-2 flex items-center gap-1.5 rounded-full bg-primary px-2.5 py-0.5 text-xs font-medium text-primary-foreground">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary-foreground opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary-foreground" />
            </span>
            {isPlaying ? "Playing" : "Paused"}
          </div>
        )}

        {/* Duration badge */}
        <div className="absolute right-2 bottom-2 rounded-md bg-black/70 px-1.5 py-0.5 text-xs text-white">
          {formatDuration(song.duration)}
        </div>
      </div>

      {/* Info */}
      <div className="flex flex-col gap-0.5 p-3">
        <p className="truncate text-sm font-semibold leading-snug">{song.title}</p>
        <p className="truncate text-xs text-muted-foreground">{song.artist}</p>
      </div>
    </div>
  );
}
