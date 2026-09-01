import { Play, Pause, SkipBack, SkipForward } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PlayerControlsProps {
  isPlaying: boolean
  isBuffering: boolean
  onPlayPause: () => void
  onPrev: () => void
  onNext: () => void
}

export function PlayerControls({
  isPlaying,
  isBuffering,
  onPlayPause,
  onPrev,
  onNext,
}: PlayerControlsProps) {
  return (
    <div className="flex items-center gap-1 sm:gap-3">
      <Button
        id="player-prev-btn"
        onClick={onPrev}
        aria-label="Previous song"
        variant="ghost"
        size="icon"
        className="h-7 w-7 text-muted-foreground hover:text-foreground"
      >
        <SkipBack className="h-4 w-4" />
      </Button>

      <Button
        id="player-playpause-btn"
        onClick={onPlayPause}
        aria-label={isPlaying ? "Pause" : "Play"}
        size="icon"
        disabled={isBuffering}
        className="h-8 w-8 rounded-full transition-transform hover:scale-105 active:scale-95 disabled:opacity-60"
      >
        {isBuffering ? (
          <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : isPlaying ? (
          <Pause className="h-4 w-4" />
        ) : (
          <Play className="h-4 w-4 translate-x-0.5" />
        )}
      </Button>

      <Button
        id="player-next-btn"
        onClick={onNext}
        aria-label="Next song"
        variant="ghost"
        size="icon"
        className="h-7 w-7 text-muted-foreground hover:text-foreground"
      >
        <SkipForward className="h-4 w-4" />
      </Button>
    </div>
  )
}