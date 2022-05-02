import {
  MouseEventHandler,
  FormEventHandler,
  useEffect,
  useState,
} from "react";
import {
  Session,
  SupabaseClient,
  SupabaseRealtimePayload,
} from "@supabase/supabase-js";
import { useGetAllMessages } from "supabase";
import { PublicMessage, PublicUser } from "types";

import styles from "../styles/Chat.module.css";

type ChatProps = {
  supabase: SupabaseClient;
  session: Session | null;
  currentUser: PublicUser | null;
};

const Chat = ({ supabase, session, currentUser }: ChatProps): JSX.Element => {
  const { chatMessages, messagesError, status } = useGetAllMessages(supabase);
  const [realTimeMsgs, setRealTimeMsgs] = useState<PublicMessage[]>([]);
  const [currentMsg, setCurrentMsg] = useState("");
  const [editingUsername, setEditingUsername] = useState(false);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    setRealTimeMsgs(chatMessages ?? []);
  }, [chatMessages]);
  useEffect(() => {
    const messagesSubscription = supabase
      .from("message")
      .on(
        "INSERT",
        ({ new: newMsg }: SupabaseRealtimePayload<PublicMessage>) => {
          setRealTimeMsgs((prev) => [...prev, newMsg]);
        }
      )
      .subscribe();
    return () => {
      supabase.removeSubscription(messagesSubscription);
    };
  }, [supabase]);
  const onMessageSubmit: MouseEventHandler<HTMLButtonElement> = async (e) => {
    e.preventDefault();
    const message = currentMsg;
    const userId = session?.user?.id;
    if (!userId) {
      throw new Error("Must be logged in to submit messages");
    }
    const { data, error } = await supabase
      .from<PublicMessage>("message")
      .insert([{ content: message, user_id: userId }]);
    setCurrentMsg("");
  };
  const logout: MouseEventHandler<HTMLButtonElement> = async (evt) => {
    evt.preventDefault();
    const { error } = await supabase.auth.signOut();
    console.log({ logOutError: error });
    // window.localStorage.clear();
    // window.location.reload();
  };
  const onSubmitUsername: FormEventHandler<HTMLFormElement> = async (evt) => {
    evt.preventDefault();
    await supabase
      .from("user")
      .insert([{ ...currentUser, username: userName }], { upsert: true });
    setUserName("");
    setEditingUsername(false);
  };
  if (messagesError) return <div>{messagesError.toString()}</div>;
  if (status === "pending" || status === "idle") return <div>...loading</div>;
  return (
    <div style={{ position: "relative", padding: "2rem 3rem 4rem" }}>
      <div className={styles.header}>
        <div className={styles.headerText}>
          <div>Supabase Chat</div>
          <p>Welcome, {currentUser?.username ?? session?.user?.email}</p>
        </div>
        <div className={styles.settings}>
          {editingUsername ? (
            <form onSubmit={onSubmitUsername}>
              <input
                onChange={(e) => setUserName(e.target.value)}
                value={userName}
                type="text"
                placeholder="new username"
                required
              />
              <button type="submit">Update username</button>
            </form>
          ) : (
            <div>
              <button onClick={() => setEditingUsername(true)}>
                Edit username
              </button>
              <button onClick={logout}>Log out</button>
            </div>
          )}
        </div>
      </div>
      <div style={{ marginTop: "10rem" }}>
        <div>
          {realTimeMsgs?.length
            ? realTimeMsgs.map((msg) => (
                <div
                  style={{
                    marginTop:".5rem",
                    padding: ".75rem .45rem",
                    border: "0.5px solid #dcd6d6",
                    borderRadius: ".30rem",
                  }}
                  key={msg.id}
                >
                  {msg.content}
                </div>
              ))
            : null}
        </div>
        <form
          style={{
            marginTop: "3rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            height: "2rem",
          }}
        >
          <input
            style={{ width: "60%", height: "100%" }}
            onChange={(e) => setCurrentMsg(e.target.value)}
            value={currentMsg}
            name="message"
            type="text"
            placeholder="Write your messsage"
            required
          />
          <button
            style={{ height: "100%", width: "20%" }}
            onClick={onMessageSubmit}
          >
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
};

export { Chat };
