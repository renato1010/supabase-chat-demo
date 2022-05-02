import "../styles/globals.css";
import type { AppProps } from "next/app";
import { useSupabase } from "utils";

function MyApp({ Component, pageProps }: AppProps) {
  const { session, supabase, currentUser } = useSupabase();
  return (
    <Component
      currentUser={currentUser}
      session={session}
      supabase={supabase}
      {...pageProps}
    />
  );
}

export default MyApp;
