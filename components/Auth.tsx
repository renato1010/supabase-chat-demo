import type { SupabaseClient } from "@supabase/supabase-js";

type AuthProps = {
  supabase: SupabaseClient;
};
const Auth = ({ supabase }: AuthProps): JSX.Element => {
  const signInWithGithub = () => {
    supabase.auth.signIn({
      provider: "github",
    });
  };
  return (
    <div>
      <button onClick={signInWithGithub}>Log in with Github</button>
    </div>
  );
};

export { Auth };
