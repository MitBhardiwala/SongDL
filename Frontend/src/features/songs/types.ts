export interface Song {
  id: string;
  videoId: string;
  title: string;
  artist: string;
  duration: number; // seconds
  thumbnailUrl: string;
  storageUrl: string;
  size: number;
  createdAt: string;
  lastAccessed: string;
}
