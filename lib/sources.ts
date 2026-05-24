import crypto from "node:crypto";
import type { Paper, TopicKey } from "./types";
import { profile, topicKeys } from "./profile";

const arxivQueries = [
  "spiking neural network test-time adaptation",
  "neuromorphic computing hardware-aware training",
  "NeuroSim DNN compute-in-memory",
  "DVFS reinforcement learning inference",
  "early exit neural network energy efficient",
  "adaptive inference dynamic voltage frequency scaling"
];

function idFor(value: string) {
  return crypto.createHash("sha1").update(value).digest("hex").slice(0, 16);
}

function stripXml(value: string) {
  return value
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

function detectTopics(text: string): TopicKey[] {
  const lower = text.toLowerCase();
  return topicKeys.filter((topic) =>
    profile.topics[topic].keywords.some((keyword) =>
      lower.includes(keyword.toLowerCase())
    )
  );
}

function parseArxivFeed(xml: string): Paper[] {
  const entries = [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)];
  return entries.map(([, entry]) => {
    const title = stripXml(entry.match(/<title>([\s\S]*?)<\/title>/)?.[1] ?? "");
    const abstract = stripXml(entry.match(/<summary>([\s\S]*?)<\/summary>/)?.[1] ?? "");
    const url = stripXml(entry.match(/<id>([\s\S]*?)<\/id>/)?.[1] ?? "");
    const publishedAt = stripXml(entry.match(/<published>([\s\S]*?)<\/published>/)?.[1] ?? "");
    const authors = [...entry.matchAll(/<name>([\s\S]*?)<\/name>/g)].map((match) =>
      stripXml(match[1])
    );
    const topics = detectTopics(`${title} ${abstract}`);

    return {
      id: idFor(url || title),
      title,
      abstract,
      authors,
      url,
      pdfUrl: url ? url.replace("/abs/", "/pdf/") : undefined,
      source: "arXiv",
      publishedAt,
      topics
    };
  });
}

export async function fetchCandidatePapers(): Promise<Paper[]> {
  const papers = new Map<string, Paper>();

  for (const query of arxivQueries) {
    const search = encodeURIComponent(`all:${query}`);
    const url = `https://export.arxiv.org/api/query?search_query=${search}&sortBy=submittedDate&sortOrder=descending&max_results=25`;
    try {
      const response = await fetch(url, {
        headers: { "User-Agent": "private-paper-recommender/0.1" },
        signal: AbortSignal.timeout(8000)
      });

      if (!response.ok) {
        continue;
      }

      for (const paper of parseArxivFeed(await response.text())) {
        if (paper.topics.length > 0) {
          papers.set(paper.id, paper);
        }
      }
    } catch {
      continue;
    }
  }

  const candidates = [...papers.values()];
  return candidates.length > 0 ? candidates : fallbackCandidates();
}

function fallbackCandidates(): Paper[] {
  const now = new Date().toISOString();
  const examples = [
    {
      title: "Test-Time Adaptation for Spiking Neural Networks under Domain Shift",
      abstract:
        "A placeholder candidate showing the target intersection of spiking neural networks, online adaptation, and robustness under changing deployment data.",
      topics: ["snn", "tta"] as TopicKey[]
    },
    {
      title: "Reinforcement Learning based DVFS for Energy-Efficient Neural Inference",
      abstract:
        "A placeholder candidate for policy-driven dynamic voltage frequency scaling during neural network inference on edge systems.",
      topics: ["rl", "dvfs"] as TopicKey[]
    },
    {
      title: "Hardware-Aware Early Exit Networks for Adaptive Inference",
      abstract:
        "A placeholder candidate covering dynamic neural networks, conditional computation, latency control, and energy-aware deployment.",
      topics: ["early_exit", "dvfs"] as TopicKey[]
    },
    {
      title: "NeuroSimDNN Modeling for Compute-in-Memory Neural Accelerators",
      abstract:
        "A placeholder candidate for NeuroSimDNN, compute-in-memory, hardware-aware training, and neuromorphic accelerator evaluation.",
      topics: ["neurosim", "snn"] as TopicKey[]
    }
  ];

  return examples.map((paper) => ({
    id: idFor(paper.title),
    title: paper.title,
    abstract: paper.abstract,
    authors: ["Seed Candidate"],
    url: "https://arxiv.org",
    source: "Seed",
    publishedAt: now,
    topics: paper.topics
  }));
}
