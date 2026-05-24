import { redirect } from "next/navigation";
import { isAuthenticated } from "../../lib/auth";
import { readStore } from "../../lib/storage";

export const dynamic = "force-dynamic";

export default async function HistoryPage() {
  if (!isAuthenticated()) {
    redirect("/login");
  }

  const store = await readStore();

  return (
    <main className="shell">
      <header className="topbar">
        <div className="brand">
          <h1>History</h1>
          <p>Recent recommendation batches and rating count.</p>
        </div>
        <nav className="nav">
          <a href="/">Today</a>
        </nav>
      </header>
      <section className="grid">
        {store.recommendations.map((day) => (
          <article className="paper" key={day.date}>
            <h2>{day.date}</h2>
            <p className="meta">{day.papers.length} papers</p>
            <ul>
              {day.papers.map((paper) => (
                <li key={paper.id}>
                  <a href={paper.url} target="_blank" rel="noreferrer">
                    {paper.title}
                  </a>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </section>
    </main>
  );
}
