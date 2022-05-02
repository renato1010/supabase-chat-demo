import type { NextPage } from "next";
import { useEffect, useState } from "react";
import Head from "next/head";
import type { UseSupaBase } from "utils";
import { Auth, Chat } from "components";
import styles from "../styles/Home.module.css";

const Home: NextPage<UseSupaBase> = ({ session, supabase, currentUser }) => {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    setLoggedIn(session ? true : false);
  }, [session]);
  return (
    <div className={styles.container}>
      <Head>
        <title>Supabase Chat App</title>
      </Head>

      <main className={styles.main}>
        {loggedIn ? (
          <Chat currentUser={currentUser} supabase={supabase} session={session} />
        ) : (
          <Auth supabase={supabase} />
        )}
      </main>
    </div>
  );
};

export default Home;
