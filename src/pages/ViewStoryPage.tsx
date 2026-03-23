import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Heart, Bookmark, Share2, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

type StoryData = {
  id: string;
  title: string;
  category: string;
  user_id: string;
  profiles: { display_name: string } | null;
};

type Block = { id: string; type: string; content: string; sort_order: number };

const ViewStoryPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const [story, setStory] = useState<StoryData | null>(null);
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      const [storyRes, blocksRes] = await Promise.all([
        supabase.from("stories").select("id, title, category, user_id, profiles(display_name)").eq("id", id).single(),
        supabase.from("story_blocks").select("*").eq("story_id", id).order("sort_order"),
      ]);

      if (storyRes.error) {
        toast({ title: "Story not found", variant: "destructive" });
      } else {
        setStory(storyRes.data as any);
      }
      setBlocks((blocksRes.data as Block[]) || []);

      // Check likes/bookmarks
      if (user) {
        const [likeRes, bmRes] = await Promise.all([
          supabase.from("story_likes").select("id").eq("story_id", id).eq("user_id", user.id).maybeSingle(),
          supabase.from("story_bookmarks").select("id").eq("story_id", id).eq("user_id", user.id).maybeSingle(),
        ]);
        setLiked(!!likeRes.data);
        setBookmarked(!!bmRes.data);
      }
      setLoading(false);
    };
    load();
  }, [id, user]);

  const toggleLike = async () => {
    if (!user || !id) return;
    if (liked) {
      await supabase.from("story_likes").delete().eq("story_id", id).eq("user_id", user.id);
    } else {
      await supabase.from("story_likes").insert({ story_id: id, user_id: user.id });
    }
    setLiked(!liked);
  };

  const toggleBookmark = async () => {
    if (!user || !id) return;
    if (bookmarked) {
      await supabase.from("story_bookmarks").delete().eq("story_id", id).eq("user_id", user.id);
    } else {
      await supabase.from("story_bookmarks").insert({ story_id: id, user_id: user.id });
    }
    setBookmarked(!bookmarked);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!story) {
    return (
      <div className="flex flex-col items-center py-32 text-center">
        <p className="font-serif text-lg">Story not found</p>
        <Link to="/" className="mt-4 text-sm text-gold hover:underline">Go home</Link>
      </div>
    );
  }

  const authorName = story.profiles?.display_name || "Unknown";

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <div className="mb-8 animate-reveal">
        <Link
          to="/dashboard"
          className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>
        <div>
          <span className="mb-2 inline-block rounded-full bg-secondary px-2.5 py-0.5 text-xs text-muted-foreground">
            {story.category}
          </span>
          <h1 className="mb-2 font-serif text-3xl font-bold leading-tight sm:text-4xl">
            {story.title}
          </h1>
          <p className="text-sm text-muted-foreground">by {authorName}</p>
        </div>
      </div>

      {user && (
        <div className="mb-8 flex gap-2 animate-reveal animate-reveal-delay-1">
          <button
            onClick={toggleLike}
            className={`flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm transition-colors active:scale-[0.97] ${
              liked ? "border-red-500/30 bg-red-500/10 text-red-400" : "border-border bg-secondary/50 text-muted-foreground hover:text-foreground"
            }`}
          >
            <Heart className={`h-4 w-4 ${liked ? "fill-current" : ""}`} /> {liked ? "Liked" : "Like"}
          </button>
          <button
            onClick={toggleBookmark}
            className={`flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm transition-colors active:scale-[0.97] ${
              bookmarked ? "border-gold/30 bg-gold/10 text-gold" : "border-border bg-secondary/50 text-muted-foreground hover:text-foreground"
            }`}
          >
            <Bookmark className={`h-4 w-4 ${bookmarked ? "fill-current" : ""}`} /> {bookmarked ? "Saved" : "Save"}
          </button>
        </div>
      )}

      <article className="space-y-6 animate-reveal animate-reveal-delay-2">
        {blocks.map((block) => (
          <div key={block.id}>
            {block.type === "text" ? (
              <p className="whitespace-pre-wrap leading-relaxed text-foreground/90" style={{ maxWidth: "65ch" }}>
                {block.content}
              </p>
            ) : block.content ? (
              block.type === "video" ? (
                <video src={block.content} controls className="w-full rounded-lg" style={{ maxHeight: 500 }} />
              ) : (
                <img
                  src={block.content}
                  alt=""
                  className="w-full rounded-lg object-contain"
                  loading="lazy"
                  style={{ maxHeight: 500 }}
                />
              )
            ) : (
              <div className="flex h-48 items-center justify-center rounded-lg border border-dashed border-border bg-secondary/20 text-sm text-muted-foreground">
                Scene illustration
              </div>
            )}
          </div>
        ))}
      </article>
    </div>
  );
};

export default ViewStoryPage;
