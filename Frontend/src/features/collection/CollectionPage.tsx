import { useState, useCallback } from "react";
import { useCollection } from "./useCollection";
import type { Song } from "../songs/types";
import { SongGrid } from "../songs/components/SongGrid";
import { PlayerBar } from "../songs/components/PlayerBar";
import { SearchBar } from "../songs/components/SearchBar";

export function CollectionPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const { songs: allSongs, removeSong } = useCollection(); // unfiltered — for PlayerBar
  const { songs, isLoading, isFetching, isError, refetch } = useCollection(searchQuery);
  const [activeSong, setActiveSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleSelectSong = useCallback(
    (song: Song) => {
      if (activeSong?.id === song.id) {
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

  const isFiltering = searchQuery.trim().length > 0;

  return (
    <>
      <div className="mx-auto w-full max-w-6xl px-4 py-8" style={{ paddingBottom: activeSong ? "96px" : "32px" }}>
        {/* Header */}
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">My Collection</h1>
            <p className="mt-1 text-sm text-muted-foreground transition-colors">
              {isLoading
                ? "Loading…"
                : isFiltering
                ? `${songs.length} of ${allSongs.length} song${allSongs.length !== 1 ? "s" : ""}`
                : `${songs.length} song${songs.length !== 1 ? "s" : ""}`}
            </p>
          </div>
          <SearchBar
            id="collection-search"
            value={searchQuery}
            onChange={setSearchQuery}
            isFetching={isFetching && isFiltering}
            placeholder="Search collection…"
          />
        </div>

        <SongGrid
          songs={songs}
          isLoading={isLoading}
          isError={isError}
          activeSong={activeSong}
          isPlaying={isPlaying}
          onSelect={handleSelectSong}
          onRetry={refetch}
          onRemove={removeSong}
          searchQuery={isFiltering ? searchQuery : undefined}
          mode="remove"
        />
      </div>

      <PlayerBar
        song={activeSong}
        songs={allSongs}
        isPlaying={isPlaying}
        onPlayPauseChange={handlePlayPauseChange}
        onSongChange={handleSongChange}
      />
    </>
  );
}
