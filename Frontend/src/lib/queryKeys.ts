export const queryKeys = {
  songs: ["songs"] as const,
  collection: ["collection"] as const,
  mutations: {
    addToCollection: ["add-to-collection"] as const,
    removeFromCollection: ["remove-from-collection"] as const,
    downloadMp3: ["download-mp3"] as const,
  }
};
