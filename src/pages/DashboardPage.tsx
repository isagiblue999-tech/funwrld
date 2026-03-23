import { Link } from "react-router-dom";
import { PenLine, BookOpen, Search, Plus } from "lucide-react";
import { useState } from "react";

const MOCK_STORIES = [
  { id: "1", title: "The Ember Crown", category: "Fantasy", updatedAt: "2 hours ago", published: true },
  { id: "2", title: "Moonlit Passage", category: "Adventure", updatedAt: "1 day ago", published: false },
  { id: "3", title: "The Last Familiar", category: "Fantasy", updatedAt: "3 days ago", published: true },
];

const DashboardPage = () => {
  const [search, setSearch] = useState("");

  const filtered = MOCK_STORIES.filter((s) =>
    s.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-8 flex items-center justify-between animate-reveal">
        <h1 className="font-serif text-2xl font-bold">Your Stories</h1>
        <Link
          to="/create"
          className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-all duration-150 hover:bg-primary/90 active:scale-[0.97]"
        >
          <Plus className="h-4 w-4" />
          New Story
        </Link>
      </div>

      {/* Search */}
      <div className="relative mb-6 animate-reveal animate-reveal-delay-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search your stories..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border border-border bg-secondary/50 py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
        />
      </div>

      {/* Story list */}
      <div className="space-y-3 animate-reveal animate-reveal-delay-2">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center py-16 text-center">
            <BookOpen className="mb-3 h-10 w-10 text-muted-foreground" />
            <p className="mb-1 font-serif text-lg font-semibold">No stories yet</p>
            <p className="mb-4 text-sm text-muted-foreground">Start writing your first tale</p>
            <Link
              to="/create"
              className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
            >
              <PenLine className="h-4 w-4" />
              Write a story
            </Link>
          </div>
        ) : (
          filtered.map((story) => (
            <Link
              key={story.id}
              to={`/story/${story.id}`}
              className="flex items-center justify-between rounded-xl border border-border bg-card p-4 transition-all duration-200 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
            >
              <div>
                <h3 className="font-serif font-semibold">{story.title}</h3>
                <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="rounded-full bg-secondary px-2 py-0.5">{story.category}</span>
                  <span>Updated {story.updatedAt}</span>
                </div>
              </div>
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  story.published
                    ? "bg-emerald-500/10 text-emerald-400"
                    : "bg-secondary text-muted-foreground"
                }`}
              >
                {story.published ? "Published" : "Draft"}
              </span>
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
