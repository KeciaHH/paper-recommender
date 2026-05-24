import { fetchCandidatePapers } from "../lib/sources";
import { recommendPapers } from "../lib/recommend";
import { readStore, saveRecommendationDay } from "../lib/storage";

export async function generateDailyRecommendations() {
  const store = await readStore();
  const candidates = await fetchCandidatePapers();
  const date = new Date().toISOString().slice(0, 10);
  const day = recommendPapers(candidates, store.ratings, date);
  await saveRecommendationDay(day);
  return day;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  generateDailyRecommendations()
    .then((day) => {
      console.log(`Generated ${day.papers.length} recommendations for ${day.date}`);
    })
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}
