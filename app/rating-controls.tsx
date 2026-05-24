"use client";

import { useState } from "react";
import type { TopicKey } from "../lib/types";

export function RatingControls({
  paperId,
  topics
}: {
  paperId: string;
  topics: TopicKey[];
}) {
  const [saved, setSaved] = useState<number | null>(null);

  async function rate(value: number) {
    const response = await fetch("/api/rate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        paperId,
        value,
        tags: topics
      })
    });

    if (response.ok) {
      setSaved(value);
    }
  }

  return (
    <div className="scores" aria-label="Rate paper relevance">
      {[1, 2, 3, 4, 5].map((value) => (
        <button
          className="score-button"
          key={value}
          onClick={() => rate(value)}
          type="button"
          title={`${value} relevance score`}
        >
          {value}
        </button>
      ))}
      {saved ? <span className="meta">Saved: {saved}/5</span> : null}
    </div>
  );
}
