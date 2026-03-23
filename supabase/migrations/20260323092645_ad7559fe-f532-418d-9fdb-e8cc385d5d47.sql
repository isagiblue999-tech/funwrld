
-- Create update_updated_at function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL DEFAULT '',
  avatar_url TEXT,
  bio TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data ->> 'display_name', NEW.email));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Stories table
CREATE TABLE public.stories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Fantasy',
  published BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.stories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published stories viewable by everyone" ON public.stories FOR SELECT USING (published = true OR auth.uid() = user_id);
CREATE POLICY "Users can insert own stories" ON public.stories FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own stories" ON public.stories FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own stories" ON public.stories FOR DELETE USING (auth.uid() = user_id);

CREATE TRIGGER update_stories_updated_at BEFORE UPDATE ON public.stories
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Story blocks table
CREATE TABLE public.story_blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  story_id UUID NOT NULL REFERENCES public.stories(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('text', 'image', 'video')),
  content TEXT NOT NULL DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.story_blocks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Blocks viewable with story" ON public.story_blocks FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.stories s WHERE s.id = story_id AND (s.published = true OR auth.uid() = s.user_id)));
CREATE POLICY "Users can insert blocks for own stories" ON public.story_blocks FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM public.stories s WHERE s.id = story_id AND auth.uid() = s.user_id));
CREATE POLICY "Users can update blocks for own stories" ON public.story_blocks FOR UPDATE
  USING (EXISTS (SELECT 1 FROM public.stories s WHERE s.id = story_id AND auth.uid() = s.user_id));
CREATE POLICY "Users can delete blocks for own stories" ON public.story_blocks FOR DELETE
  USING (EXISTS (SELECT 1 FROM public.stories s WHERE s.id = story_id AND auth.uid() = s.user_id));

-- Likes table
CREATE TABLE public.story_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  story_id UUID NOT NULL REFERENCES public.stories(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (story_id, user_id)
);

ALTER TABLE public.story_likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Likes viewable by everyone" ON public.story_likes FOR SELECT USING (true);
CREATE POLICY "Users can insert own likes" ON public.story_likes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own likes" ON public.story_likes FOR DELETE USING (auth.uid() = user_id);

-- Bookmarks table
CREATE TABLE public.story_bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  story_id UUID NOT NULL REFERENCES public.stories(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (story_id, user_id)
);

ALTER TABLE public.story_bookmarks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own bookmarks" ON public.story_bookmarks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own bookmarks" ON public.story_bookmarks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own bookmarks" ON public.story_bookmarks FOR DELETE USING (auth.uid() = user_id);

-- Storage bucket for story media
INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('story-media', 'story-media', true, 52428800);

CREATE POLICY "Anyone can view story media" ON storage.objects FOR SELECT USING (bucket_id = 'story-media');
CREATE POLICY "Authenticated users can upload story media" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'story-media' AND auth.role() = 'authenticated');
CREATE POLICY "Users can update own story media" ON storage.objects FOR UPDATE USING (bucket_id = 'story-media' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can delete own story media" ON storage.objects FOR DELETE USING (bucket_id = 'story-media' AND auth.uid()::text = (storage.foldername(name))[1]);
