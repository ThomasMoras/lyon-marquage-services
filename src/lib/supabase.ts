import { createClient } from "@supabase/supabase-js";

// For client-side operations (browser)
export const createClientSideSupabaseClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

  return createClient(supabaseUrl, supabaseAnonKey);
};

// For server-side operations (API routes)
export const createServerSideSupabaseClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string;

  return createClient(supabaseUrl, supabaseServiceRoleKey);
};

// Helper function to get a file's public URL
export const getFilePublicUrl = (bucket: string, path: string) => {
  const supabase = createClientSideSupabaseClient();
  return supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl;
};

// Constants
export const STORAGE_BUCKET = "lyonmarquage";
