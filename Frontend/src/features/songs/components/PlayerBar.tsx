import { useRef, useEffect, useState, useCallback } from "react"
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
} from "lucide-react"
import type { Song } from "../types"
import { formatDuration } from "../utils"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"

interface PlayerBarProps {
  song: Song | null
  songs: Song[]
  isPlaying: boolean
  onPlayPauseChange: (playing: boolean) => void
  onSongChange: (song: Song) => void
}

export function PlayerBar({
  song,
  songs,
  isPlaying,
  onPlayPauseChange,
  onSongChange,
}: PlayerBarProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)

  // Sync play/pause with external state
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    if (isPlaying) {
      audio.play().catch(() => {})
    } else {
      audio.pause()
    }
  }, [isPlaying])

  // Load new song when it changes
  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !song) return
    audio.src = song.storageUrl
    audio.load()
    setCurrentTime(0)
    setDuration(song.duration)
    if (isPlaying) {
      audio.play().catch(() => {})
    }
  }, [song?.id]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleTimeUpdate = useCallback(() => {
    const audio = audioRef.current
    if (audio) setCurrentTime(audio.currentTime)
  }, [])

  const handleLoadedMetadata = useCallback(() => {
    const audio = audioRef.current
    if (audio) setDuration(audio.duration)
  }, [])

  const handleEnded = useCallback(() => {
    if (!song || songs.length === 0) return
    const currentIndex = songs.findIndex((s) => s.id === song.id)
    const nextSong = songs[(currentIndex + 1) % songs.length]
    onSongChange(nextSong)
  }, [song, songs, onSongChange])

  // Slider (shadcn) emits an array of numbers, so we adapt to the same logic as before
  const handleSeek = (value: number | readonly number[]) => {
    const val = Array.isArray(value) ? value[0] : value
    setCurrentTime(val)
    if (audioRef.current) audioRef.current.currentTime = val
  }

  const handleVolumeChange = (value: number | readonly number[]) => {
    const val = Array.isArray(value) ? value[0] : value
    setVolume(val)
    if (audioRef.current) {
      audioRef.current.volume = val
      setIsMuted(false)
      audioRef.current.muted = false
    }
  }

  const toggleMute = () => {
    if (!audioRef.current) return
    const next = !isMuted
    setIsMuted(next)
    audioRef.current.muted = next
  }

  const skipPrev = () => {
    if (!song || songs.length === 0) return
    const idx = songs.findIndex((s) => s.id === song.id)
    onSongChange(songs[(idx - 1 + songs.length) % songs.length])
  }

  const skipNext = () => {
    if (!song || songs.length === 0) return
    const idx = songs.findIndex((s) => s.id === song.id)
    onSongChange(songs[(idx + 1) % songs.length])
  }

  return (
    <>
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
      />

      <div
        id="player-bar"
        className={`fixed right-0 bottom-0 left-0 z-50 border-t border-border bg-background/95 backdrop-blur-md transition-transform duration-300 ${
          song ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-3 py-2.5 sm:flex-row sm:items-center sm:gap-6 sm:px-4 sm:py-3">
          {/* Top row on mobile: song info + play controls */}
          <div className="flex items-center gap-3 sm:contents">
            {/* Song info */}
            <div className="flex min-w-0 flex-1 items-center gap-3">
              {song && (
                <>
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
                    <p className="truncate text-xs text-muted-foreground">
                      {song.artist}
                    </p>
                  </div>
                </>
              )}
            </div>

            {/* Controls + progress */}
            <div className="flex flex-shrink-0 items-center gap-3 sm:flex-1 sm:flex-col sm:gap-1.5">
              {/* Buttons */}
              <div className="flex items-center gap-1 sm:gap-3">
                <Button
                  id="player-prev-btn"
                  onClick={skipPrev}
                  aria-label="Previous song"
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-muted-foreground hover:text-foreground"
                >
                  <SkipBack className="h-4 w-4" />
                </Button>

                <Button
                  id="player-playpause-btn"
                  onClick={() => onPlayPauseChange(!isPlaying)}
                  aria-label={isPlaying ? "Pause" : "Play"}
                  size="icon"
                  className="h-8 w-8 rounded-full transition-transform hover:scale-105 active:scale-95"
                >
                  {isPlaying ? (
                    <Pause className="h-4 w-4" />
                  ) : (
                    <Play className="h-4 w-4 translate-x-0.5" />
                  )}
                </Button>

                <Button
                  id="player-next-btn"
                  onClick={skipNext}
                  aria-label="Next song"
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-muted-foreground hover:text-foreground"
                >
                  <SkipForward className="h-4 w-4" />
                </Button>
              </div>

              {/* Progress bar - hidden on mobile in this row, shown below instead */}
              <div className="hidden w-full max-w-sm items-center gap-2 sm:flex">
                <span className="w-8 text-right text-xs text-muted-foreground tabular-nums">
                  {formatDuration(currentTime)}
                </span>
                <Slider
                  id="player-progress"
                  min={0}
                  max={duration || 1}
                  step={0.1}
                  value={[currentTime]}
                  onValueChange={handleSeek}
                  aria-label="Seek"
                  className="flex-1 cursor-pointer"
                />
                <span className="w-8 text-xs text-muted-foreground tabular-nums">
                  {formatDuration(duration || (song?.duration ?? 0))}
                </span>
              </div>
            </div>
          </div>

          {/* Progress bar row - mobile only, full width below song info/controls */}
          <div className="flex w-full items-center gap-2 sm:hidden">
            <span className="w-8 text-right text-xs text-muted-foreground tabular-nums">
              {formatDuration(currentTime)}
            </span>
            <Slider
              id="player-progress-mobile"
              min={0}
              max={duration || 1}
              step={0.1}
              value={[currentTime]}
              onValueChange={handleSeek}
              aria-label="Seek"
              className="flex-1 cursor-pointer"
            />
            <span className="w-8 text-xs text-muted-foreground tabular-nums">
              {formatDuration(duration || (song?.duration ?? 0))}
            </span>
          </div>

          {/* Volume - hidden on mobile */}
          <div className="hidden flex-1 items-center justify-start gap-2 sm:flex">
            <Button
              id="player-mute-btn"
              onClick={toggleMute}
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
              onValueChange={handleVolumeChange}
              aria-label="Volume"
              className="!w-32 cursor-pointer"
            />
          </div>
        </div>
      </div>
    </>
  )
}
