import { useCallback, useEffect, useState } from "react";
import {
  PostgrestError,
  RealtimeSubscription,
  SupabaseClient,
  SupabaseRealtimePayload,
} from "@supabase/supabase-js";
import type { PublicMessage } from "types";

const getAllMessages = async (
  supabase: SupabaseClient
): Promise<{
  messages: PublicMessage[] | null;
  error: PostgrestError | null;
}> => {
  let { data: messages, error } = await supabase
    .from<PublicMessage>("message")
    .select("*");
  return { messages, error };
};

// useGetAllMessages Hook

export const useGetAllMessages = (
  supabase: SupabaseClient,
  immediate = true
) => {
  const [chatMessages, setChatMessages] = useState<PublicMessage[] | null>([]);
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

export const getMessagesInsertSubscription = async (supabase: SupabaseClient) => {
  const messagesInsertSubscription =  supabase
    .from("message")
    .on("INSERT", (payload: SupabaseRealtimePayload<PublicMessage>) => {
      console.log("Change received!", payload);
    })
    .subscribe();

  return { messagesInsertSubscription };
};

export const useMessagesInsertSubscription = (
  supabase: SupabaseClient,
  immediate = true
) => {
  const [subscription, setSubscription] = useState<RealtimeSubscription | null>(
    null
  );
  const [messagesError, setMessagesError] = useState<
    PostgrestError | string | null
  >(null);
  const [status, setStatus] = useState<
    "idle" | "pending" | "success" | "error"
  >("idle");
  const execute = useCallback(async () => {
    setStatus("pending");
    setMessagesError(null);
    try {
      const { messagesInsertSubscription } =
        await getMessagesInsertSubscription(supabase);
      setSubscription(messagesInsertSubscription);
      setStatus("success");
    } catch (error) {
      setMessagesError("Error processing messages subscription");
      setStatus("error");
    }
  }, [supabase]);
  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);
  return { subscription, messagesError, status, execute };
};
