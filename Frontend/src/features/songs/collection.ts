import { api } from "../../lib/api";

export async function addToCollection(songId: string) {
  const response = await api.post("/collection", { songId });
  return response.data;
}
