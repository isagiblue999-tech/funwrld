import { Link } from "react-router-dom";
import { BookOpen, PenLine, Compass, Sparkles, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const CATEGORIES = ["Fantasy", "Adventure", "Romance", "Horror", "Sci-Fi", "Mystery"];

type PublicStory = {
  id: string;
  title: string;
  category: string;
  user_id: string;
  profiles: { display_name: string } | null;
};

const HomePage = () => {
  const [stories, setStories] = useState<PublicStory[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterCat, setFilterCat] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      let query = supabase
        .from("stories")
        .select("id, title, category, user_id, profiles(display_name)")
        .eq("published", true)
        .order("created_at", { ascending: false })
        .limit(8);

      const { data } = await query;
      setStories((data as PublicStory[]) || []);
      setLoading(false);
    };
    load();
  }, []);

  const filtered = filterCat ? stories.filter((s) => s.category === filterCat) : stories;

  return (
    <div className="mx-auto max-w-5xl px-4">
      {/* Hero */}
      <section className="flex flex-col items-center py-16 text-center sm:py-24 animate-reveal">
        <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-secondary">
          <Sparkles className="h-7 w-7 text-gold" />
        </div>
        <h1 className="mb-4 font-serif text-4xl font-bold leading-[1.1] sm:text-5xl">
          Stories that breathe<br />between the lines
        </h1>
        <p className="mb-8 max-w-md text-muted-foreground">
          Create immersive tales woven with text, images, and video. Read stories that unfold like scenes.
        </p>
        <div className="flex gap-3">
          <Link
            to="/create"
            className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-all duration-150 hover:bg-primary/90 active:scale-[0.97] shadow-lg shadow-primary/20"
          >
            <PenLine className="h-4 w-4" />
            Write a story
          </Link>
          <Link
            to="/dashboard"
            className="flex items-center gap-2 rounded-lg border border-border bg-secondary px-5 py-2.5 text-sm font-medium text-foreground transition-all duration-150 hover:bg-secondary/80 active:scale-[0.97]"
          >
            <Compass className="h-4 w-4" />
            Explore
          </Link>
        </div>
      </section>

      {/* Categories */}
      <section className="mb-12 animate-reveal animate-reveal-delay-1">
        <h2 className="mb-4 font-serif text-xl font-semibold">Browse by genre</h2>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCat(filterCat === cat ? null : cat)}
              className={`rounded-full border px-4 py-1.5 text-sm transition-colors duration-150 active:scale-[0.97] ${
                filterCat === cat
                  ? "border-gold bg-gold/10 text-gold"
                  : "border-border bg-secondary/50 text-muted-foreground hover:border-primary/40 hover:text-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Stories */}
      <section className="mb-16 animate-reveal animate-reveal-delay-2">
        <h2 className="mb-4 font-serif text-xl font-semibold">Recent tales</h2>
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : filtered.length === 0 ? (
          <p className="py-12 text-center text-muted-foreground">No published stories yet. Be the first to write one!</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {filtered.map((story) => (
              <Link
                key={story.id}
                to={`/story/${story.id}`}
                className="group rounded-xl border border-border bg-card p-5 transition-all duration-200 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
              >
                <div className="mb-2 flex items-center justify-between">
                  <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs text-muted-foreground">
                    {story.category}
                  </span>
                  <BookOpen className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-gold" />
                </div>
                <h3 className="mb-1 font-serif text-lg font-semibold transition-colors group-hover:text-gold">
                  {story.title}
                </h3>
                <p className="text-xs text-muted-foreground">by {story.profiles?.display_name || "Unknown"}</p>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default HomePage;
