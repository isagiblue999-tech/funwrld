import { Link } from "react-router-dom";
import { BookOpen, PenLine, Compass, Sparkles } from "lucide-react";

const SAMPLE_STORIES = [
  { id: "1", title: "The Ember Crown", author: "Aria Blackwood", category: "Fantasy", excerpt: "In a kingdom where fire whispers secrets to those who listen..." },
  { id: "2", title: "Moonlit Passage", author: "Calen Morrow", category: "Adventure", excerpt: "She found the door at the bottom of the well, carved with symbols older than language..." },
  { id: "3", title: "The Last Familiar", author: "Dorian Vex", category: "Fantasy", excerpt: "When the world forgot magic, one creature remembered everything..." },
  { id: "4", title: "Rust and Roses", author: "Elara Finch", category: "Romance", excerpt: "He built machines. She grew gardens. The wall between them was crumbling..." },
];

const CATEGORIES = ["Fantasy", "Adventure", "Romance", "Horror", "Sci-Fi", "Mystery"];

const HomePage = () => {
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
              className="rounded-full border border-border bg-secondary/50 px-4 py-1.5 text-sm text-muted-foreground transition-colors duration-150 hover:border-primary/40 hover:text-foreground active:scale-[0.97]"
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Featured Stories */}
      <section className="mb-16 animate-reveal animate-reveal-delay-2">
        <h2 className="mb-4 font-serif text-xl font-semibold">Recent tales</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {SAMPLE_STORIES.map((story) => (
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
              <p className="mb-2 text-sm text-muted-foreground line-clamp-2">{story.excerpt}</p>
              <p className="text-xs text-muted-foreground">by {story.author}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
