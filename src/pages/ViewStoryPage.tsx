import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Heart, Bookmark, Share2 } from "lucide-react";

const MOCK_STORY = {
  id: "1",
  title: "The Ember Crown",
  author: "Aria Blackwood",
  category: "Fantasy",
  blocks: [
    { type: "text" as const, content: "The throne room had been empty for a hundred years. Dust clung to the obsidian pillars like grey moss, and the stained glass windows — once depicting the fire gods of old — were cracked, letting thin blades of moonlight fall across the stone floor." },
    { type: "image" as const, content: "" },
    { type: "text" as const, content: '"You shouldn\'t be here," whispered a voice from the shadows.\n\nKira froze, her hand still resting on the armrest of the throne. The wood was warm. Impossibly warm, as if something still burned within it.' },
    { type: "text" as const, content: 'She turned slowly. A figure stood in the archway — tall, cloaked, with eyes that glowed like dying coals.\n\n"Neither should you," Kira replied.' },
    { type: "image" as const, content: "" },
    { type: "text" as const, content: "The figure stepped forward, and the dust on the floor swirled away from their feet as if repelled. With each step, the cracks in the windows began to seal — color bleeding back into the glass like ink in water.\n\n\"The crown chose you,\" the figure said. \"Whether you want it or not.\"" },
  ],
};

const ViewStoryPage = () => {
  const { id } = useParams();

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      {/* Header */}
      <div className="mb-8 animate-reveal">
        <Link
          to="/dashboard"
          className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <span className="mb-2 inline-block rounded-full bg-secondary px-2.5 py-0.5 text-xs text-muted-foreground">
              {MOCK_STORY.category}
            </span>
            <h1 className="mb-2 font-serif text-3xl font-bold leading-tight sm:text-4xl">
              {MOCK_STORY.title}
            </h1>
            <p className="text-sm text-muted-foreground">by {MOCK_STORY.author}</p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="mb-8 flex gap-2 animate-reveal animate-reveal-delay-1">
        <button className="flex items-center gap-1.5 rounded-lg border border-border bg-secondary/50 px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground active:scale-[0.97]">
          <Heart className="h-4 w-4" /> Like
        </button>
        <button className="flex items-center gap-1.5 rounded-lg border border-border bg-secondary/50 px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground active:scale-[0.97]">
          <Bookmark className="h-4 w-4" /> Save
        </button>
        <button className="flex items-center gap-1.5 rounded-lg border border-border bg-secondary/50 px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground active:scale-[0.97]">
          <Share2 className="h-4 w-4" /> Share
        </button>
      </div>

      {/* Content */}
      <article className="space-y-6 animate-reveal animate-reveal-delay-2">
        {MOCK_STORY.blocks.map((block, i) => (
          <div key={i}>
            {block.type === "text" ? (
              <p className="whitespace-pre-wrap leading-relaxed text-foreground/90" style={{ maxWidth: "65ch" }}>
                {block.content}
              </p>
            ) : block.content ? (
              <img
                src={block.content}
                alt=""
                className="w-full rounded-lg object-contain"
                loading="lazy"
                style={{ maxHeight: 500 }}
              />
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
