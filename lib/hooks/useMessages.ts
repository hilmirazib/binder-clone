import { useState, useEffect, useCallback, useRef } from "react";
import { toast } from "sonner";
import { MessageService, Message } from "@/lib/services/messageService";

interface UseMessagesOptions {
  groupId: string;
  autoScrollToBottom?: boolean;
}

export function useMessages({
  groupId,
  autoScrollToBottom = true,
}: UseMessagesOptions) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [sending, setSending] = useState(false);
  const subscriptionRef = useRef<{ unsubscribe: () => void } | null>(null);

  // Load messages
  const loadMessages = useCallback(
    async (beforeId?: string) => {
      try {
        setLoading(true);
        setError(null);

        const result = await MessageService.getMessages(groupId, 50, beforeId);

        if (beforeId) {
          // Loading older messages (pagination)
          setMessages((prev) => [...result.messages, ...prev]);
        } else {
          // Initial load
          setMessages(result.messages);
        }

        setHasMore(result.hasMore);
      } catch (err) {
        const error = err as Error;
        console.error("Failed to load messages:", error);
        setError(error);
        toast.error("Failed to load messages");
      } finally {
        setLoading(false);
      }
    },
    [groupId],
  );

  // Send message
  const sendMessage = useCallback(
    async (content: string) => {
      if (sending || !content.trim()) return;

      setSending(true);
      try {
        const newMessage = await MessageService.sendMessage(
          groupId,
          content.trim(),
        );
        // Add message immediately to avoid waiting for real-time subscription
        setMessages((prev) => {
          // Avoid duplicates
          if (prev.some((msg) => msg.id === newMessage.id)) {
            return prev;
          }
          return [...prev, newMessage];
        });
      } catch (error) {
        console.error("Failed to send message:", error);
        toast.error("Failed to send message");
      } finally {
        setSending(false);
      }
    },
    [groupId, sending],
  );

  // Load more messages (pagination)
  const loadMore = useCallback(async () => {
    if (!hasMore || loading) return;

    const oldestMessage = messages[0];
    if (!oldestMessage) return;

    await loadMessages(oldestMessage.id);
  }, [hasMore, loading, messages, loadMessages]);

  // Setup real-time subscription
  useEffect(() => {
    let isMounted = true;

    // Load initial messages
    loadMessages();

    // Setup real-time subscription
    subscriptionRef.current = MessageService.subscribeToMessages(
      groupId,
      (newMessage) => {
        if (!isMounted) return;

        setMessages((prev) => {
          // Avoid duplicates
          if (prev.some((msg) => msg.id === newMessage.id)) {
            return prev;
          }
          return [...prev, newMessage];
        });

        // Auto-scroll to bottom
        if (autoScrollToBottom) {
          setTimeout(() => {
            window.scrollTo({
              top: document.body.scrollHeight,
              behavior: "smooth",
            });
          }, 100);
        }
      },
      (error) => {
        console.error("Message subscription error:", error);
        toast.error("Connection lost. Messages may not update in real-time.");
      },
    );

    return () => {
      isMounted = false;
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
      }
    };
  }, [groupId, loadMessages, autoScrollToBottom]);

  return {
    messages,
    loading,
    error,
    hasMore,
    sending,
    sendMessage,
    loadMore,
    retry: () => loadMessages(),
  };
}
