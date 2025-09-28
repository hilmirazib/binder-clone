import { useState, useEffect, useRef } from "react";
import { MessageService } from "@/lib/services/messageService";
import { useAuth } from "@/lib/hooks/useAuth";
import { supabase } from "../supabase";

interface TypingUser {
  userId: string;
  displayName: string | null;
  username: string | null;
  avatarEmoji: string | null;
  avatarColor: string | null;
}

interface UseTypingOptions {
  groupId: string;
}

export function useTyping({ groupId }: UseTypingOptions) {
  const { user } = useAuth();
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([]);
  const subscriptionRef = useRef<{ unsubscribe: () => void } | null>(null);
  const userCacheRef = useRef<Map<string, TypingUser>>(new Map());

  // Send typing indicator
  const sendTypingIndicator = async (isTyping: boolean) => {
    await MessageService.sendTypingIndicator(groupId, isTyping);
  };

  // Get user info from cache or fetch
  const getUserInfo = async (userId: string): Promise<TypingUser> => {
    if (userCacheRef.current.has(userId)) {
      return userCacheRef.current.get(userId)!;
    }

    try {
      const { data: profile } = await supabase
        .from("Profile")
        .select("userId, displayName, username, avatarEmoji, avatarColor")
        .eq("userId", userId)
        .single();

      const userInfo: TypingUser = {
        userId,
        displayName: profile?.displayName || null,
        username: profile?.username || null,
        avatarEmoji: profile?.avatarEmoji || null,
        avatarColor: profile?.avatarColor || null,
      };

      userCacheRef.current.set(userId, userInfo);
      return userInfo;
    } catch (error) {
      // Fallback user info
      const fallback: TypingUser = {
        userId,
        displayName: null,
        username: null,
        avatarEmoji: "👤",
        avatarColor: "#6B7280",
      };
      userCacheRef.current.set(userId, fallback);
      return fallback;
    }
  };

  // Setup typing subscription
  useEffect(() => {
    let isMounted = true;

    subscriptionRef.current = MessageService.subscribeToTyping(
      groupId,
      async (data) => {
        if (!isMounted || data.userId === user?.id) return;

        const userInfo = await getUserInfo(data.userId);

        setTypingUsers((prev) => {
          if (data.isTyping) {
            // Add user to typing list
            if (prev.some((u) => u.userId === data.userId)) return prev;
            return [...prev, userInfo];
          } else {
            // Remove user from typing list
            return prev.filter((u) => u.userId !== data.userId);
          }
        });
      },
    );

    return () => {
      isMounted = false;
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
      }
    };
  }, [groupId, user?.id]);

  return {
    typingUsers: typingUsers.filter((u) => u.userId !== user?.id),
    sendTypingIndicator,
  };
}
