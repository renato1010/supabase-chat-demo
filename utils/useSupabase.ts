import { useEffect, useState } from "react";
import { createClient, Session, SupabaseClient } from "@supabase/supabase-js";
import { PublicUser } from "types";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const publicKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLIC_API_KEY;

if (!url || !publicKey) {
  throw new Error("Error starting app");
}
const supabase = createClient(url, publicKey);

export type UseSupaBase = {
  session: Session | null;
  supabase: SupabaseClient;
  currentUser: PublicUser | null;
};

const useSupabase = (): UseSupaBase => {
  const [currentUser, setCurrentUser] = useState<PublicUser | null>(null);
  const [session, setSession] = useState(supabase.auth.session());

  supabase.auth.onAuthStateChange(async (_event, session) => {
    setSession(session);
  });

  useEffect(() => {
    const getCurrentUser = async () => {
      if (session?.user?.id) {
        const { data: currentUser } = await supabase
          .from<PublicUser>("user")
          .select("*")
          .eq("id", session.user.id);
        if (currentUser?.length) {
          const foundUser = currentUser[0];
          return foundUser;
        } else {
          return null;
        }
      }
      return null;
    };
    getCurrentUser().then((currentUser) => {
      setCurrentUser(currentUser);
    });
    return () => {
      supabase.removeAllSubscriptions();
    };
  }, [session]);

  useEffect(() => {
    if (currentUser) {
      supabase
        .from(`user:id=eq.${currentUser.id}`)
        .on("UPDATE", ({ new: newUser }) => {
          setCurrentUser(newUser);
        })
        .subscribe();
    }
  }, [currentUser]);

  return { session, supabase, currentUser };
};

export { useSupabase };
