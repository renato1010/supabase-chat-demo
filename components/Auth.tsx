import type { SupabaseClient } from "@supabase/supabase-js";
import { FormEventHandler, MouseEventHandler, useRef, useState } from "react";
import styles from "../styles/Auth.module.css";

type AuthProps = {
  supabase: SupabaseClient;
};

const Auth = ({ supabase }: AuthProps) => {
  const [error, setError] = useState("");
  const [sentEmail, setSentEmail] = useState(false);

  const emailRef = useRef<HTMLInputElement>(null);
  const signIn: FormEventHandler<HTMLFormElement> = async (evt) => {
    evt.preventDefault();
    const email = emailRef?.current?.value;
    const { error } = await supabase.auth.signIn({ email });
    error ? setError(error.message) : setSentEmail(true);
  };

  const signInWithGitHub: MouseEventHandler<HTMLButtonElement> = (evt) => {
    evt.preventDefault();
    supabase.auth.signIn({ provider: "github" });
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Supabase Chat</h1>

      {error ? <p className={styles.error}>{error}</p> : null}

      {sentEmail ? (
        <p>
          We&apos;ve sent you an email to login! Check your email to continue.
        </p>
      ) : (
        <>
          <form onSubmit={signIn}>
            <input
              className={styles.input}
              placeholder="your@email.com"
              type="text"
              ref={emailRef}
              required
            />

            <button className={styles.submit} type="submit">
              Login
            </button>
          </form>

          <p>
            <button className={styles.github} onClick={signInWithGitHub}>
              Sign in with GitHub
            </button>
          </p>
        </>
      )}
    </div>
  );
};

export { Auth };
