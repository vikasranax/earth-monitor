import { fetchAllNews } from "@/lib/providers/news";

export const dynamic = "force-dynamic";

export default async function NewsPage() {
  const { articles, error } = await fetchAllNews();

  return (
    <main className="min-h-screen bg-[#05070a] text-[#e6ebf1] p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2 font-[family-name:var(--font-display)]">
          News Wire
        </h1>
        <p className="text-[#a8b3c1] mb-8 text-sm">
          Guardian API + Indian RSS — merged, deduplicated, sorted live.
        </p>

        {error && (
          <div className="mb-6 p-4 border border-[#ff4d4f]/30 bg-[#ff4d4f]/10 rounded text-[#ff4d4f] text-sm">
            {error}
          </div>
        )}

        <div className="space-y-4">
          {articles.map((article) => (
            <a
              key={article.id}
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-5 rounded-lg border border-[#212832] bg-[#0a0d12] hover:bg-[#10151c] transition-colors"
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-[10px] uppercase tracking-wider text-[#ff7a1a] font-mono">
                  {article.source}
                </span>
                <span className="text-[10px] text-[#454e59] font-mono">
                  {new Date(article.publishedAt).toLocaleString()}
                </span>
              </div>
              <h2 className="text-lg font-semibold text-[#e6ebf1] mb-1">{article.title}</h2>
              <p className="text-sm text-[#a8b3c1] line-clamp-2">{article.summary}</p>
            </a>
          ))}

          {articles.length === 0 && !error && (
            <p className="text-[#6b7684] text-sm">No articles available right now.</p>
          )}
        </div>
      </div>
    </main>
  );
}
