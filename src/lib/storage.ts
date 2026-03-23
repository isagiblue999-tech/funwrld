import { supabase } from "@/integrations/supabase/client";

export const uploadStoryMedia = async (
  userId: string,
  file: File
): Promise<string> => {
  const ext = file.name.split(".").pop();
  const path = `${userId}/${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage
    .from("story-media")
    .upload(path, file, { cacheControl: "3600", upsert: false });

  if (error) throw error;

  const { data } = supabase.storage.from("story-media").getPublicUrl(path);
  return data.publicUrl;
};
