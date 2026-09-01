import type { Song } from "../types"
import { PlayerControls } from "./PlayerBar/PlayerControls"
import { PlayerProgressBar } from "./PlayerBar/PlayerProgressBar"
import { PlayerSongInfo } from "./PlayerBar/PlayerSongInfo"
import { PlayerVolumeControl } from "./PlayerBar/PlayerVolumeControl"
import { useAudioPlayer } from "./PlayerBar/useAudioPlayer"
import { useMediaSession } from "./PlayerBar/useMediaSession"


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
  const {
    audioRef,
    currentTime,
    duration,
    volume,
    isMuted,
    isBuffering,
    audioEventHandlers,
    handleSeek,
    handleVolumeChange,
    toggleMute,
    skipPrev,
    skipNext,
  } = useAudioPlayer({ song, songs, isPlaying, onSongChange })

  useMediaSession({ song, isPlaying, onPlayPauseChange, skipPrev, skipNext })

  return (
    <>
      <audio ref={audioRef} {...audioEventHandlers} />

      <div
        id="player-bar"
        className={`fixed right-0 bottom-0 left-0 z-50 border-t border-border bg-background/95 backdrop-blur-md transition-transform duration-300 ${
          song ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-3 py-2.5 sm:flex-row sm:items-center sm:gap-6 sm:px-4 sm:py-3">
          {/* Top row on mobile: song info + play controls */}
          <div className="flex items-center gap-3 sm:contents">
            {song && <PlayerSongInfo song={song} />}

            {/* Controls + progress */}
            <div className="flex flex-shrink-0 items-center gap-3 sm:flex-1 sm:flex-col sm:gap-1.5">
              <PlayerControls
                isPlaying={isPlaying}
                isBuffering={isBuffering}
                onPlayPause={() => onPlayPauseChange(!isPlaying)}
                onPrev={skipPrev}
                onNext={skipNext}
              />

              {/* Progress bar - hidden on mobile in this row, shown below instead */}
              <PlayerProgressBar
                id="player-progress"
                currentTime={currentTime}
                duration={duration}
                fallbackDuration={song?.duration ?? 0}
                isBuffering={isBuffering}
                onSeek={handleSeek}
                className="hidden w-full max-w-sm sm:flex"
              />
            </div>
          </div>

          {/* Progress bar row - mobile only, full width below song info/controls */}
          <PlayerProgressBar
            id="player-progress-mobile"
            currentTime={currentTime}
            duration={duration}
            fallbackDuration={song?.duration ?? 0}
            isBuffering={isBuffering}
            onSeek={handleSeek}
            className="w-full sm:hidden"
          />

          <PlayerVolumeControl
            volume={volume}
            isMuted={isMuted}
            onToggleMute={toggleMute}
            onVolumeChange={handleVolumeChange}
          />
        </div>
      </div>
    </>
  )
}