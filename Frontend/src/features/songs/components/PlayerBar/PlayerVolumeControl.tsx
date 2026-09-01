import { Volume2, VolumeX } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"

interface PlayerVolumeControlProps {
  volume: number
  isMuted: boolean
  onToggleMute: () => void
  onVolumeChange: (value: number | readonly number[]) => void
}

export function PlayerVolumeControl({
  volume,
  isMuted,
  onToggleMute,
  onVolumeChange,
}: PlayerVolumeControlProps) {
  return (
    <div className="hidden flex-1 items-center justify-start gap-2 sm:flex">
      <Button
        id="player-mute-btn"
        onClick={onToggleMute}
        aria-label={isMuted ? "Unmute" : "Mute"}
        variant="ghost"
        size="icon"
        className="h-7 w-7 text-muted-foreground hover:text-foreground"
      >
        {isMuted || volume === 0 ? (
          <VolumeX className="h-4 w-4" />
        ) : (
          <Volume2 className="h-4 w-4" />
        )}
      </Button>
      <Slider
        id="player-volume"
        min={0}
        max={1}
        step={0.02}
        value={[isMuted ? 0 : volume]}
        onValueChange={onVolumeChange}
        aria-label="Volume"
        className="!w-32 cursor-pointer"
      />
    </div>
  )
}