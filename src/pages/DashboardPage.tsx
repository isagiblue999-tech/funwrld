import { Link, useNavigate } from "react-router-dom";
import { PenLine, BookOpen, Search, Plus, Trash2, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";

type Story = {
  id: string;
  title: string;
  category: string;
  published: boolean;
  updated_at: string;
};

const DashboardPage = () => {
  const [search, setSearch] = useState("");
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!user) { navigate("/auth"); return; }
    fetchStories();
  }, [user]);

  const fetchStories = async () => {
    const { data, error } = await supabase
      .from("stories")
      .select("id, title, category, published, updated_at")
      .eq("user_id", user!.id)
      .order("updated_at", { ascending: false });

    if (error) {
      toast({ title: "Error loading stories", description: error.message, variant: "destructive" });
    } else {
      setStories(data || []);
    }
    setLoading(false);
  };

  const deleteStory = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const { error } = await supabase.from("stories").delete().eq("id", id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setStories((s) => s.filter((st) => st.id !== id));
    }
  };

  const filtered = stories.filter((s) =>
    s.title.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

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
                  <span>Updated {formatDistanceToNow(new Date(story.updated_at), { addSuffix: true })}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    story.published
                      ? "bg-emerald-500/10 text-emerald-400"
                      : "bg-secondary text-muted-foreground"
                  }`}
                >
                  {story.published ? "Published" : "Draft"}
                </span>
                <button
                  onClick={(e) => deleteStory(story.id, e)}
                  className="rounded p-1.5 text-muted-foreground transition-colors hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
