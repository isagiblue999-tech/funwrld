import { User, BookOpen, Heart, Settings } from "lucide-react";

const ProfilePage = () => {
  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      {/* Profile header */}
      <div className="mb-8 flex items-center gap-4 animate-reveal">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary text-gold font-serif text-2xl font-bold">
          A
        </div>
        <div>
          <h1 className="font-serif text-xl font-bold">Aria Blackwood</h1>
          <p className="text-sm text-muted-foreground">Storyteller since 2024</p>
        </div>
      </div>

      {/* Stats */}
      <div className="mb-8 grid grid-cols-3 gap-3 animate-reveal animate-reveal-delay-1">
        {[
          { label: "Stories", value: "7", icon: BookOpen },
          { label: "Likes", value: "142", icon: Heart },
          { label: "Followers", value: "38", icon: User },
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} className="rounded-xl border border-border bg-card p-4 text-center">
            <Icon className="mx-auto mb-2 h-5 w-5 text-muted-foreground" />
            <p className="font-serif text-lg font-bold">{value}</p>
            <p className="text-xs text-muted-foreground">{label}</p>
          </div>
        ))}
      </div>

      {/* Settings placeholder */}
      <div className="animate-reveal animate-reveal-delay-2">
        <h2 className="mb-4 font-serif text-lg font-semibold">Settings</h2>
        <div className="space-y-2">
          {["Edit Profile", "Change Password", "Notification Preferences"].map((item) => (
            <button
              key={item}
              className="flex w-full items-center justify-between rounded-xl border border-border bg-card p-4 text-sm transition-colors hover:border-primary/30 active:scale-[0.99]"
            >
              <span>{item}</span>
              <Settings className="h-4 w-4 text-muted-foreground" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
