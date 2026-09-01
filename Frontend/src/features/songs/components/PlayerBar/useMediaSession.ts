import { useEffect } from "react"
import type { Song } from "../../types"

interface UseMediaSessionArgs {
  song: Song | null
  isPlaying: boolean
  onPlayPauseChange: (playing: boolean) => void
  skipPrev: () => void
  skipNext: () => void
}

/**
 * Keeps the OS-level "now playing" UI (lock screen, notification shade,
 * Bluetooth/car display) in sync with the current song and play state,
 * and wires hardware/lock-screen controls back to the player.
 */
export function useMediaSession({
  song,
  isPlaying,
  onPlayPauseChange,
  skipPrev,
  skipNext,
}: UseMediaSessionArgs) {
  // Metadata: title, artist, artwork
  useEffect(() => {
    if (!song || !("mediaSession" in navigator)) return

    navigator.mediaSession.metadata = new MediaMetadata({
      title: song.title,
      artist: song.artist,
      album: "My Music",
      artwork: [
        { src: song.thumbnailUrl, sizes: "96x96", type: "image/jpeg" },
        { src: song.thumbnailUrl, sizes: "256x256", type: "image/jpeg" },
        { src: song.thumbnailUrl, sizes: "512x512", type: "image/jpeg" },
      ],
    })
  }, [song?.id]) // eslint-disable-line react-hooks/exhaustive-deps

  // Action handlers: play, pause, previous, next
  useEffect(() => {
    if (!("mediaSession" in navigator)) return

    navigator.mediaSession.setActionHandler("play", () => onPlayPauseChange(true))
    navigator.mediaSession.setActionHandler("pause", () => onPlayPauseChange(false))
    navigator.mediaSession.setActionHandler("previoustrack", skipPrev)
    navigator.mediaSession.setActionHandler("nexttrack", skipNext)

    return () => {
      navigator.mediaSession.setActionHandler("play", null)
      navigator.mediaSession.setActionHandler("pause", null)
      navigator.mediaSession.setActionHandler("previoustrack", null)
      navigator.mediaSession.setActionHandler("nexttrack", null)
    }
  }, [onPlayPauseChange, skipPrev, skipNext])

  // Playback state (affects which icon the OS shows)
  useEffect(() => {
    if (!("mediaSession" in navigator)) return
    navigator.mediaSession.playbackState = isPlaying ? "playing" : "paused"
  }, [isPlaying])
}