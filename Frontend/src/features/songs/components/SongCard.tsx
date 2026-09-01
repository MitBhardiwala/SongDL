import { Play, Pause, Loader2, MoreVertical, Plus, Trash2 } from "lucide-react"
import type { Song } from "../types"
import { formatDuration } from "../utils"
import { useCollection, useRemoveFromCollection } from "../useCollection"
import { useAuth } from "@/hooks/useAuth"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

interface SongCardProps {
  song: Song
  isPlaying: boolean
  isActive: boolean
  onSelect: (song: Song) => void
  mode?: "add" | "remove"
}

export function SongCard({
  song,
  isPlaying,
  isActive,
  onSelect,
  mode = "add",
}: SongCardProps) {
  const { mutate: addSong, isPending: isAdding } = useCollection()
  const { mutate: removeSong, isPending: isRemoving } =
    useRemoveFromCollection()
  const { session } = useAuth()

  const isPending = mode === "add" ? isAdding : isRemoving

  const handleCollectionAction = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (mode === "add") {
      addSong(song.id)
    } else {
      removeSong(song.id)
    }
  }

  return (
    <div
      id={`song-card-${song.id}`}
      role="button"
      tabIndex={0}
      aria-label={`Play ${song.title}`}
      onClick={() => onSelect(song)}
      onKeyDown={(e) => e.key === "Enter" && onSelect(song)}
      className={`group relative flex cursor-pointer flex-col overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${isActive ? "border-primary ring-1 ring-primary/50" : "border-border"} `}
    >
      {/* Thumbnail */}
      <div className="relative aspect-video w-full overflow-hidden bg-muted">
        <img
          src={song.thumbnailUrl}
          alt={song.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
          onError={(e) => {
            ;(e.currentTarget as HTMLImageElement).src =
              "https://placehold.co/320x180/1a1a1a/555?text=No+Image"
          }}
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/30 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />

        {/* Collection action button — Dropdown Menu */}
        {session && (
          <div
            className={`absolute top-2 right-2 z-10 transition-all duration-200 sm:opacity-0 sm:group-hover:opacity-100 ${isPending ? "opacity-100 sm:opacity-100" : ""}`}
            onClick={(e) => e.stopPropagation()}
          >
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full bg-black/50 text-white hover:bg-black/70 hover:text-white"
                  aria-label="More options"
                  disabled={isPending}
                >
                  {isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <MoreVertical className="h-4 w-4" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem
                  onClick={handleCollectionAction}
                  disabled={isPending}
                >
                  {mode === "add" ? (
                    <>
                      <Plus className="mr-2 h-4 w-4" />
                      <span>Add to Collection</span>
                    </>
                  ) : (
                    <>
                      <Trash2 className="mr-2 h-4 w-4 text-destructive" />
                      <span className="text-destructive">
                        Remove from Collection
                      </span>
                    </>
                  )}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}

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
        <p className="truncate text-sm leading-snug font-semibold">
          {song.title}
        </p>
        <p className="truncate text-xs text-muted-foreground">{song.artist}</p>
      </div>
    </div>
  )
}
