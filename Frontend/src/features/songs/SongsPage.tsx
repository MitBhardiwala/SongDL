import { useState, useCallback } from "react";
import { useSongs } from "./useSongs";
import type { Song } from "./types";
import { SongGrid } from "./components/SongGrid";
import { PlayerBar } from "./components/PlayerBar";


export function SongsPage() {
  const { songs, isLoading, isError, refetch } = useSongs();
  const [activeSong, setActiveSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleSelectSong = useCallback(
    (song: Song) => {
      if (activeSong?.id === song.id) {
        // Toggle play/pause on the same song
        setIsPlaying((prev) => !prev);
      } else {
        setActiveSong(song);
        setIsPlaying(true);
      }
    },
    [activeSong]
  );

  const handlePlayPauseChange = useCallback((playing: boolean) => {
    setIsPlaying(playing);
  }, []);

  const handleSongChange = useCallback((song: Song) => {
    setActiveSong(song);
    setIsPlaying(true);
  }, []);

  return (
    <>
      <div className="mx-auto w-full max-w-6xl px-4 py-8" style={{ paddingBottom: activeSong ? "96px" : "32px" }}>
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight">Library</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {isLoading ? "Loading…" : `${songs.length} song${songs.length !== 1 ? "s" : ""}`}
          </p>
        </div>

        <SongGrid
          songs={songs}
          isLoading={isLoading}
          isError={isError}
          activeSong={activeSong}
          isPlaying={isPlaying}
          onSelect={handleSelectSong}
          onRetry={refetch}
        />
      </div>

      <PlayerBar  
        song={activeSong}
        songs={songs}
        isPlaying={isPlaying}
        onPlayPauseChange={handlePlayPauseChange}
        onSongChange={handleSongChange}
      />
    </>
  );
}
