export type TopicKey =
  | "snn"
  | "tta"
  | "neurosim"
  | "rl"
  | "dvfs"
  | "early_exit";

export type Paper = {
  id: string;
  title: string;
  abstract: string;
  authors: string[];
  url: string;
  pdfUrl?: string;
  source: string;
  publishedAt: string;
  topics: TopicKey[];
  score?: number;
  reason?: string;
};

export type Rating = {
  paperId: string;
  value: number;
  tags: string[];
  note?: string;
  createdAt: string;
};

export type RecommendationDay = {
  date: string;
  papers: Paper[];
};

export type Store = {
  recommendations: RecommendationDay[];
  ratings: Rating[];
};
