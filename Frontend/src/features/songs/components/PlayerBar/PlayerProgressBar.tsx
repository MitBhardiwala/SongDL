import { Slider } from "@/components/ui/slider"
import { formatDuration } from "../../utils"

interface PlayerProgressBarProps {
  id: string
  currentTime: number
  duration: number
  fallbackDuration: number
  isBuffering: boolean
  onSeek: (value: number | readonly number[]) => void
  className?: string
}

export function PlayerProgressBar({
  id,
  currentTime,
  duration,
  fallbackDuration,
  isBuffering,
  onSeek,
  className = "",
}: PlayerProgressBarProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="w-8 text-right text-xs text-muted-foreground tabular-nums">
        {formatDuration(currentTime)}
      </span>

      {isBuffering ? (
        <div className="h-1.5 flex-1 animate-pulse rounded-full bg-muted" />
      ) : (
        <Slider
          id={id}
          min={0}
          max={duration || 1}
          step={0.1}
          value={[currentTime]}
          onValueChange={onSeek}
          aria-label="Seek"
          className="flex-1 cursor-pointer"
        />
      )}

      <span className="w-8 text-xs text-muted-foreground tabular-nums">
        {formatDuration(duration || fallbackDuration)}
      </span>
    </div>
  )
}