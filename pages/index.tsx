import type { NextPage } from "next";
import { useEffect, useState } from "react";
import Head from "next/head";
import type { UseSupaBase } from "utils";
import { Auth } from "components";
import styles from "../styles/Home.module.css";

const Home: NextPage<UseSupaBase> = ({ session, supabase }) => {
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
        {loggedIn ? <span>Logged in</span> : <Auth supabase={supabase} />}
      </main>
    </div>
  );
};

export default Home;
