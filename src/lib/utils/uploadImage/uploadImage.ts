import { supabase } from "../supabaseClient";

export async function uploadAvatarToSupabase(file: File, userId: string) {
  const fileExt = file.name.split(".").pop();
  const fileName = `${userId}_${Date.now()}.${fileExt}`;
  const filePath = `${fileName}`;

  // Upload file
  const { error } = await supabase.storage
    .from("images")
    .upload(filePath, file, { upsert: true });

  if (error) throw error;

  // Lấy public URL
  const { data } = supabase.storage.from("images").getPublicUrl(filePath);

  return {
    url: data.publicUrl,
    filename: fileName,
  };
}

export function getAvatarUrl(filename: string) {
  console.log("🌐 getAvatarUrl called with filename:", filename);
  if (!filename) return "";
  return supabase.storage.from("images").getPublicUrl(filename).data.publicUrl;
}
