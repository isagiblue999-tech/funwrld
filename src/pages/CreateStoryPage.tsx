import { useState } from "react";
import { Plus, Image, Film, Type, GripVertical, Trash2, Eye, Send } from "lucide-react";

type Block = {
  id: string;
  type: "text" | "image" | "video";
  content: string;
};

let blockIdCounter = 0;
const newId = () => `block-${++blockIdCounter}`;

const CreateStoryPage = () => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Fantasy");
  const [blocks, setBlocks] = useState<Block[]>([
    { id: newId(), type: "text", content: "" },
  ]);
  const [preview, setPreview] = useState(false);

  const addBlock = (type: Block["type"]) => {
    setBlocks([...blocks, { id: newId(), type, content: "" }]);
  };

  const updateBlock = (id: string, content: string) => {
    setBlocks(blocks.map((b) => (b.id === id ? { ...b, content } : b)));
  };

  const removeBlock = (id: string) => {
    if (blocks.length <= 1) return;
    setBlocks(blocks.filter((b) => b.id !== id));
  };

  const handleMediaUpload = (id: string, file: File) => {
    // In production, upload to cloud storage. For now, use local URL.
    const url = URL.createObjectURL(file);
    updateBlock(id, url);
  };

  const CATEGORIES = ["Fantasy", "Adventure", "Romance", "Horror", "Sci-Fi", "Mystery"];

  if (preview) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="font-serif text-2xl font-bold">{title || "Untitled Story"}</h1>
          <button
            onClick={() => setPreview(false)}
            className="rounded-lg border border-border bg-secondary px-4 py-2 text-sm font-medium transition-colors hover:bg-secondary/80 active:scale-[0.97]"
          >
            Back to editing
          </button>
        </div>
        <p className="mb-6 text-xs text-muted-foreground">{category}</p>
        <div className="space-y-6">
          {blocks.map((block) => (
            <div key={block.id}>
              {block.type === "text" ? (
                <p className="whitespace-pre-wrap leading-relaxed">{block.content || "..."}</p>
              ) : block.content ? (
                block.type === "video" ? (
                  <video
                    src={block.content}
                    controls
                    className="w-full rounded-lg"
                    style={{ maxHeight: 400 }}
                  />
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
                <div className="flex h-40 items-center justify-center rounded-lg border border-dashed border-border bg-secondary/30 text-sm text-muted-foreground">
                  No media uploaded
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <div className="mb-8 animate-reveal">
        <h1 className="mb-6 font-serif text-2xl font-bold">Create a Story</h1>

        <input
          type="text"
          placeholder="Story title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mb-4 w-full rounded-lg border border-border bg-secondary/50 px-4 py-3 font-serif text-lg text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="rounded-lg border border-border bg-secondary/50 px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* Blocks */}
      <div className="space-y-4 animate-reveal animate-reveal-delay-1">
        {blocks.map((block, index) => (
          <div
            key={block.id}
            className="group relative rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/20"
          >
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <GripVertical className="h-4 w-4 cursor-grab" />
                <span className="uppercase tracking-wider">
                  {block.type === "text" ? "Text" : block.type === "image" ? "Image / GIF" : "Video"}
                </span>
              </div>
              <button
                onClick={() => removeBlock(block.id)}
                className="rounded p-1 text-muted-foreground opacity-0 transition-all hover:text-destructive group-hover:opacity-100"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>

            {block.type === "text" ? (
              <textarea
                value={block.content}
                onChange={(e) => updateBlock(block.id, e.target.value)}
                placeholder="Write your scene..."
                rows={4}
                className="w-full resize-none rounded-lg border-0 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
            ) : (
              <div>
                {block.content ? (
                  <div className="relative">
                    {block.type === "video" ? (
                      <video src={block.content} controls className="w-full rounded-lg" style={{ maxHeight: 300 }} />
                    ) : (
                      <img src={block.content} alt="" className="w-full rounded-lg object-contain" style={{ maxHeight: 300 }} />
                    )}
                    <button
                      onClick={() => updateBlock(block.id, "")}
                      className="absolute right-2 top-2 rounded-full bg-background/80 p-1.5 text-foreground backdrop-blur-sm hover:bg-destructive hover:text-destructive-foreground transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ) : (
                  <label className="flex h-32 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-border bg-secondary/30 text-sm text-muted-foreground transition-colors hover:border-primary/40 hover:bg-secondary/50">
                    {block.type === "video" ? (
                      <>
                        <Film className="mb-2 h-6 w-6" />
                        <span>Upload video (max 20s)</span>
                      </>
                    ) : (
                      <>
                        <Image className="mb-2 h-6 w-6" />
                        <span>Upload image or GIF</span>
                      </>
                    )}
                    <input
                      type="file"
                      className="hidden"
                      accept={block.type === "video" ? "video/*" : "image/*"}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleMediaUpload(block.id, file);
                      }}
                    />
                  </label>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add block buttons */}
      <div className="mt-4 flex flex-wrap gap-2 animate-reveal animate-reveal-delay-2">
        <button
          onClick={() => addBlock("text")}
          className="flex items-center gap-1.5 rounded-lg border border-border bg-secondary/50 px-3 py-2 text-sm text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground active:scale-[0.97]"
        >
          <Type className="h-4 w-4" /> Text
        </button>
        <button
          onClick={() => addBlock("image")}
          className="flex items-center gap-1.5 rounded-lg border border-border bg-secondary/50 px-3 py-2 text-sm text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground active:scale-[0.97]"
        >
          <Image className="h-4 w-4" /> Image / GIF
        </button>
        <button
          onClick={() => addBlock("video")}
          className="flex items-center gap-1.5 rounded-lg border border-border bg-secondary/50 px-3 py-2 text-sm text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground active:scale-[0.97]"
        >
          <Film className="h-4 w-4" /> Video
        </button>
      </div>

      {/* Actions */}
      <div className="mt-8 flex gap-3">
        <button
          onClick={() => setPreview(true)}
          className="flex items-center gap-1.5 rounded-lg border border-border bg-secondary px-4 py-2.5 text-sm font-medium transition-colors hover:bg-secondary/80 active:scale-[0.97]"
        >
          <Eye className="h-4 w-4" /> Preview
        </button>
        <button className="flex items-center gap-1.5 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-all duration-150 hover:bg-primary/90 active:scale-[0.97] shadow-lg shadow-primary/20">
          <Send className="h-4 w-4" /> Publish
        </button>
      </div>
    </div>
  );
};

export default CreateStoryPage;
