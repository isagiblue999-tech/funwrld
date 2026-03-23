import { User, BookOpen, Heart, Settings, Loader2, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const ProfilePage = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profile, setProfile] = useState<{ display_name: string; bio: string } | null>(null);
  const [storyCount, setStoryCount] = useState(0);
  const [likeCount, setLikeCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");

  useEffect(() => {
    if (!user) { navigate("/auth"); return; }
    const load = async () => {
      const [profileRes, storiesRes, likesRes] = await Promise.all([
        supabase.from("profiles").select("display_name, bio").eq("user_id", user.id).single(),
        supabase.from("stories").select("id", { count: "exact", head: true }).eq("user_id", user.id),
        supabase.from("story_likes").select("id", { count: "exact", head: true })
          .in("story_id", (await supabase.from("stories").select("id").eq("user_id", user.id)).data?.map((s) => s.id) || []),
      ]);
      if (profileRes.data) {
        setProfile(profileRes.data);
        setDisplayName(profileRes.data.display_name);
        setBio(profileRes.data.bio || "");
      }
      setStoryCount(storiesRes.count || 0);
      setLikeCount(likesRes.count || 0);
      setLoading(false);
    };
    load();
  }, [user]);

  const saveProfile = async () => {
    if (!user) return;
    const { error } = await supabase
      .from("profiles")
      .update({ display_name: displayName, bio })
      .eq("user_id", user.id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setProfile({ display_name: displayName, bio });
      setEditing(false);
      toast({ title: "Profile updated!" });
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <div className="mb-8 flex items-center gap-4 animate-reveal">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary text-gold font-serif text-2xl font-bold">
          {(profile?.display_name || "?")[0].toUpperCase()}
        </div>
        <div>
          {editing ? (
            <input
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="mb-1 rounded border border-border bg-secondary/50 px-2 py-1 font-serif text-xl font-bold text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          ) : (
            <h1 className="font-serif text-xl font-bold">{profile?.display_name}</h1>
          )}
          <p className="text-sm text-muted-foreground">{user?.email}</p>
        </div>
      </div>

      {editing && (
        <div className="mb-6 animate-reveal">
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell us about yourself..."
            rows={3}
            className="mb-3 w-full rounded-lg border border-border bg-secondary/50 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <div className="flex gap-2">
            <button onClick={saveProfile} className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 active:scale-[0.97]">
              Save
            </button>
            <button onClick={() => setEditing(false)} className="rounded-lg border border-border bg-secondary px-4 py-2 text-sm font-medium hover:bg-secondary/80 active:scale-[0.97]">
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="mb-8 grid grid-cols-2 gap-3 animate-reveal animate-reveal-delay-1">
        {[
          { label: "Stories", value: storyCount, icon: BookOpen },
          { label: "Likes received", value: likeCount, icon: Heart },
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} className="rounded-xl border border-border bg-card p-4 text-center">
            <Icon className="mx-auto mb-2 h-5 w-5 text-muted-foreground" />
            <p className="font-serif text-lg font-bold">{value}</p>
            <p className="text-xs text-muted-foreground">{label}</p>
          </div>
        ))}
      </div>

      <div className="space-y-2 animate-reveal animate-reveal-delay-2">
        <button
          onClick={() => setEditing(true)}
          className="flex w-full items-center justify-between rounded-xl border border-border bg-card p-4 text-sm transition-colors hover:border-primary/30 active:scale-[0.99]"
        >
          <span>Edit Profile</span>
          <Settings className="h-4 w-4 text-muted-foreground" />
        </button>
        <button
          onClick={handleSignOut}
          className="flex w-full items-center justify-between rounded-xl border border-border bg-card p-4 text-sm text-red-400 transition-colors hover:border-red-500/30 active:scale-[0.99]"
        >
          <span>Sign Out</span>
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
