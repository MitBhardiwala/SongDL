import type { Song } from "../../types"

interface PlayerSongInfoProps {
  song: Song
}

export function PlayerSongInfo({ song }: PlayerSongInfoProps) {
  return (
    <div className="flex min-w-0 flex-1 items-center gap-3">
      <img
        src={song.thumbnailUrl}
        alt={song.title}
        className="h-10 w-10 flex-shrink-0 rounded-md object-cover"
        onError={(e) => {
          ;(e.currentTarget as HTMLImageElement).src =
            "https://placehold.co/40x40/1a1a1a/555?text=♪"
        }}
      />
      <div className="min-w-0">
        <p className="truncate text-sm font-medium">{song.title}</p>
        <p className="truncate text-xs text-muted-foreground">{song.artist}</p>
      </div>
    </div>
  )
}