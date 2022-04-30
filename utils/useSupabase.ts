import { useState } from "react";
import { createClient, Session, SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const publicKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLIC_API_KEY;

if (!url || !publicKey) {
  throw new Error("Error starting app");
}
const supabase = createClient(url, publicKey);

export type UseSupaBase = {
  session: Session | null;
  supabase: SupabaseClient;
};

const useSupabase = (): UseSupaBase => {
  const [session, setSession] = useState(supabase.auth.session());

  supabase.auth.onAuthStateChange(async (_event, session) => {
    setSession(session);
  });
  return { session, supabase };
};

export { useSupabase };
