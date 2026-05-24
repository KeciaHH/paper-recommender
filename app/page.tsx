import { redirect } from "next/navigation";
import { isAuthenticated } from "../lib/auth";
import { getLatestRecommendations } from "../lib/storage";
import { profile } from "../lib/profile";
import { RatingControls } from "./rating-controls";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  if (!isAuthenticated()) {
    redirect("/login");
  }

  const day = await getLatestRecommendations();

  return (
    <main className="shell">
      <header className="topbar">
        <div className="brand">
          <h1>Daily Paper Recommendations</h1>
          <p>{day ? `Generated for ${day.date}` : profile.fieldDescription}</p>
        </div>
        <nav className="nav">
          <a href="/history">History</a>
        </nav>
      </header>

      {!day ? (
        <section className="paper">
          <h2>No recommendations yet</h2>
          <p className="empty">
            Run <code>npm run daily</code> to fetch candidate papers and generate today&apos;s list.
          </p>
        </section>
      ) : (
        <section className="grid">
          {day.papers.map((paper, index) => (
            <article className="paper" key={paper.id}>
              <div className="meta">#{index + 1} · {paper.source} · {paper.publishedAt.slice(0, 10)}</div>
              <h2>
                <a href={paper.url} target="_blank" rel="noreferrer">
                  {paper.title}
                </a>
              </h2>
              <div className="meta">{paper.authors.slice(0, 6).join(", ")}</div>
              <p className="reason">{paper.reason}</p>
              <div className="tags">
                {paper.topics.map((topic) => (
                  <span className="tag" key={topic}>
                    {profile.topics[topic].label}
                  </span>
                ))}
              </div>
              <p className="abstract">{paper.abstract}</p>
              <div className="actions">
                {paper.pdfUrl ? (
                  <a className="button" href={paper.pdfUrl} target="_blank" rel="noreferrer">
                    PDF
                  </a>
                ) : null}
                <a className="button" href={paper.url} target="_blank" rel="noreferrer">
                  Source
                </a>
              </div>
              <RatingControls paperId={paper.id} topics={paper.topics} />
            </article>
          ))}
        </section>
      )}
    </main>
  );
}
