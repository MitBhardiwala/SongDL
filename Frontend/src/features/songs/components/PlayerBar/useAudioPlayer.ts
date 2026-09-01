import { useRef, useEffect, useState, useCallback } from "react"
import type { Song } from "../../types"

interface UseAudioPlayerArgs {
    song: Song | null
    songs: Song[]
    isPlaying: boolean
    onSongChange: (song: Song) => void
}

/**
 * Owns the <audio> element and all state/logic derived from it:
 * current time, duration, volume, mute, buffering, seek, and
 * prev/next navigation through the song list.
 */
export function useAudioPlayer({ song, songs, isPlaying, onSongChange }: UseAudioPlayerArgs) {
    const audioRef = useRef<HTMLAudioElement | null>(null)
    const [currentTime, setCurrentTime] = useState(0)
    const [duration, setDuration] = useState(0)
    const [volume, setVolume] = useState(1)
    const [isMuted, setIsMuted] = useState(false)
    const [isBuffering, setIsBuffering] = useState(false)

    // Sync play/pause with external state
    useEffect(() => {
        const audio = audioRef.current
        if (!audio) return
        if (isPlaying) {
            audio.play().catch(() => { })
        } else {
            audio.pause()
        }
    }, [isPlaying])

    // Load new song when it changes
    useEffect(() => {
        const audio = audioRef.current
        if (!audio || !song) return
        setIsBuffering(true) // we know a new song is coming
        audio.src = song.storageUrl
        audio.load()
        setCurrentTime(0)
        setDuration(song.duration)
        if (isPlaying) {
            audio.play().catch(() => { })
        }
    }, [song?.id]) // eslint-disable-line react-hooks/exhaustive-deps

    const handleWaiting = useCallback(() => setIsBuffering(true), [])
    const handleCanPlay = useCallback(() => setIsBuffering(false), [])
    const handlePlaying = useCallback(() => setIsBuffering(false), [])

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

    const handleSeek = useCallback((value: number | readonly number[]) => {
        const val = Array.isArray(value) ? value[0] : value
        setCurrentTime(val)
        if (audioRef.current) audioRef.current.currentTime = val
    }, [])

    const handleVolumeChange = useCallback((value: number | readonly number[]) => {
        const val = Array.isArray(value) ? value[0] : value
        setVolume(val)
        if (audioRef.current) {
            audioRef.current.volume = val
            setIsMuted(false)
            audioRef.current.muted = false
        }
    }, [])

    const toggleMute = useCallback(() => {
        if (!audioRef.current) return
        setIsMuted((prev) => {
            const next = !prev
            audioRef.current!.muted = next
            return next
        })
    }, [])

    const skipPrev = useCallback(() => {
        if (!song || songs.length === 0) return
        const idx = songs.findIndex((s) => s.id === song.id)
        onSongChange(songs[(idx - 1 + songs.length) % songs.length])
    }, [song, songs, onSongChange])

    const skipNext = useCallback(() => {
        if (!song || songs.length === 0) return
        const idx = songs.findIndex((s) => s.id === song.id)
        onSongChange(songs[(idx + 1) % songs.length])
    }, [song, songs, onSongChange])

    const audioEventHandlers = {
        onTimeUpdate: handleTimeUpdate,
        onLoadedMetadata: handleLoadedMetadata,
        onEnded: handleEnded,
        onWaiting: handleWaiting,
        onCanPlay: handleCanPlay,
        onPlaying: handlePlaying,
    }

    return {
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
    }
}