export const queryKeys = {
  songs: (q = "") => ["songs", q] as const,
  collection: (q = "") => ["collection", q] as const,
  mutations: {
    addToCollection: ["add-to-collection"] as const,
    removeFromCollection: ["remove-from-collection"] as const,
    downloadMp3: ["download-mp3"] as const,
  },
};
