import type { Paper, Rating, RecommendationDay, TopicKey } from "./types";
import { profile, topicKeys } from "./profile";

function countMatches(text: string, keywords: string[]) {
  const lower = text.toLowerCase();
  return keywords.reduce(
    (count, keyword) => count + (lower.includes(keyword.toLowerCase()) ? 1 : 0),
    0
  );
}

function feedbackBoost(paper: Paper, ratings: Rating[]) {
  if (ratings.length === 0) {
    return 0;
  }

  const weightedTopics = new Map<TopicKey, number>();
  for (const rating of ratings) {
    const delta = rating.value - 3;
    const ratedTopics = rating.tags.filter((tag): tag is TopicKey =>
      topicKeys.includes(tag as TopicKey)
    );
    for (const topic of ratedTopics) {
      weightedTopics.set(topic, (weightedTopics.get(topic) ?? 0) + delta);
    }
  }

  return paper.topics.reduce((boost, topic) => boost + (weightedTopics.get(topic) ?? 0), 0);
}

function scorePaper(paper: Paper, ratings: Rating[]) {
  const text = `${paper.title} ${paper.abstract}`;
  const topicScore = topicKeys.reduce(
    (score, topic) => score + countMatches(text, profile.topics[topic].keywords) * 8,
    0
  );
  const penalty = countMatches(text, profile.negativeKeywords) * 6;
  const crossTopicBonus = Math.max(0, paper.topics.length - 1) * 10;
  const freshness = Math.max(
    0,
    20 -
      (Date.now() - new Date(paper.publishedAt || Date.now()).getTime()) /
        (1000 * 60 * 60 * 24 * 14)
  );

  return topicScore + crossTopicBonus + freshness + feedbackBoost(paper, ratings) * 4 - penalty;
}

export function recommendPapers(candidates: Paper[], ratings: Rating[], date: string): RecommendationDay {
  const scored = candidates
    .map((paper) => ({
      ...paper,
      score: scorePaper(paper, ratings),
      reason: buildReason(paper)
    }))
    .sort((a, b) => (b.score ?? 0) - (a.score ?? 0));

  const picked: Paper[] = [];
  const topicCounts = new Map<TopicKey, number>();

  for (const paper of scored) {
    if (picked.length >= 10) {
      break;
    }

    const hasUnderfilledTopic = paper.topics.some(
      (topic) => (topicCounts.get(topic) ?? 0) < profile.topics[topic].quota
    );

    if (hasUnderfilledTopic || picked.length >= 7) {
      picked.push(paper);
      for (const topic of paper.topics) {
        topicCounts.set(topic, (topicCounts.get(topic) ?? 0) + 1);
      }
    }
  }

  return { date, papers: picked.slice(0, 10) };
}

function buildReason(paper: Paper) {
  if (paper.topics.length === 0) {
    return "Matches the general research profile.";
  }
  const labels = paper.topics.map((topic) => profile.topics[topic].label);
  return `Matches ${labels.join(", ")}.`;
}
