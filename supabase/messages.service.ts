import { useCallback, useEffect, useState } from "react";
import { PostgrestError, SupabaseClient } from "@supabase/supabase-js";

const getAllMessages = async (
  supabase: SupabaseClient
): Promise<{
  messages: Record<string, string | number>[] | null;
  error: PostgrestError | null;
}> => {
  let { data: messages, error } = await supabase
    .from<Record<string, string | number>>("message")
    .select("*");
  return { messages, error };
};

// useGetAllMessages Hook

export const useGetAllMessages = (
  supabase: SupabaseClient,
  immediate = true
) => {
  const [chatMessages, setChatMessages] = useState<
    Record<string, string | number>[] | null
  >([]);
  const [messagesError, setMessagesError] = useState<
    PostgrestError | string | null
  >(null);
  const [status, setStatus] = useState<
    "idle" | "pending" | "success" | "error"
  >("idle");
  const execute = useCallback(async () => {
    setStatus("pending");
    setChatMessages(null);
    setMessagesError(null);
    try {
      const { error, messages } = await getAllMessages(supabase);
      if (error) {
        setMessagesError(error);
        setStatus("error");
      } else {
        setChatMessages(messages);
        setStatus("success");
      }
    } catch (error) {
      setMessagesError("Error getting all messages");
      setStatus("error");
    }
  }, [supabase]);
  // Call execute if we want to fire it right away.
  // Otherwise execute can be called later, such as
  // in an onClick handler.
  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);
  return { execute, status, chatMessages, messagesError };
};
