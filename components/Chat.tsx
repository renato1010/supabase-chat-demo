import { SupabaseClient } from "@supabase/supabase-js";
import { useGetAllMessages } from "supabase";

type ChatProps = {
  supabase: SupabaseClient;
};

const Chat = ({ supabase }: ChatProps): JSX.Element => {
  const { chatMessages, messagesError, status } = useGetAllMessages(supabase);
  if (messagesError) return <div>{messagesError.toString()}</div>;
  if (status === "pending" || status === "idle") return <div>...loading</div>;
  return (
    <div>
      <div>Chat</div>
      <ul>
        {chatMessages?.length
          ? chatMessages.map((msg) => <li key={msg.id}>{msg.content}</li>)
          : null}
      </ul>
    </div>
  );
};

export { Chat };
