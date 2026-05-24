import { promises as fs } from "node:fs";
import path from "node:path";
import type { Rating, RecommendationDay, Store } from "./types";

const dataPath = path.join(process.cwd(), "data", "store.json");

const emptyStore = (): Store => ({
  recommendations: [],
  ratings: []
});

export async function readStore(): Promise<Store> {
  try {
    const raw = await fs.readFile(dataPath, "utf8");
    return JSON.parse(raw) as Store;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return emptyStore();
    }
    throw error;
  }
}

export async function writeStore(store: Store) {
  await fs.mkdir(path.dirname(dataPath), { recursive: true });
  await fs.writeFile(dataPath, `${JSON.stringify(store, null, 2)}\n`);
}

export async function getLatestRecommendations() {
  const store = await readStore();
  return store.recommendations[0] ?? null;
}

export async function saveRecommendationDay(day: RecommendationDay) {
  const store = await readStore();
  store.recommendations = [
    day,
    ...store.recommendations.filter((entry) => entry.date !== day.date)
  ].slice(0, 90);
  await writeStore(store);
}

export async function saveRating(rating: Rating) {
  const store = await readStore();
  store.ratings = [
    rating,
    ...store.ratings.filter((entry) => entry.paperId !== rating.paperId)
  ];
  await writeStore(store);
}
