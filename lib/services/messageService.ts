import { supabase } from "@/lib/supabase";

export interface Message {
  id: string;
  groupId: string;
  userId: string;
  content: string;
  createdAt: string;
  author: {
    userId: string;
    displayName: string | null;
    username: string | null;
    avatarEmoji: string | null;
    avatarColor: string | null;
  };
}

export class MessageService {
  // Send message to group
  static async sendMessage(groupId: string, content: string): Promise<Message> {
    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        throw new Error("User not authenticated");
      }

      // Validate user is group member
      const { data: membership } = await supabase
        .from("GroupMember")
        .select("userId")
        .eq("groupId", groupId)
        .eq("userId", user.id)
        .single();

      if (!membership) {
        throw new Error("You are not a member of this group");
      }

      // Insert message
      const { data: message, error: messageError } = await supabase
        .from("Message")
        .insert({
          groupId,
          userId: user.id,
          content: content.trim(),
        })
        .select(
          `
          id,
          groupId,
          userId,
          content,
          createdAt,
          author:Profile(
            userId,
            displayName,
            username,
            avatarEmoji,
            avatarColor
          )
        `,
        )
        .single();

      if (messageError) throw messageError;

      return message as Message;
    } catch (error) {
      console.error("Failed to send message:", error);
      throw error;
    }
  }

  // Get message history with pagination
  static async getMessages(
    groupId: string,
    limit = 50,
    beforeId?: string,
  ): Promise<{
    messages: Message[];
    hasMore: boolean;
  }> {
    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        throw new Error("User not authenticated");
      }

      // Validate user is group member
      const { data: membership } = await supabase
        .from("GroupMember")
        .select("userId")
        .eq("groupId", groupId)
        .eq("userId", user.id)
        .single();

      if (!membership) {
        throw new Error("You are not a member of this group");
      }

      let query = supabase
        .from("Message")
        .select(
          `
          id,
          groupId,
          userId,
          content,
          createdAt,
          author:Profile(
            userId,
            displayName,
            username,
            avatarEmoji,
            avatarColor
          )
        `,
        )
        .eq("groupId", groupId)
        .order("createdAt", { ascending: false })
        .limit(limit + 1); // Get one extra to check pagination

      if (beforeId) {
        // Get messages before this timestamp (for pagination)
        const { data: beforeMessage } = await supabase
          .from("Message")
          .select("createdAt")
          .eq("id", beforeId)
          .single();

        if (beforeMessage) {
          query = query.lt("createdAt", beforeMessage.createdAt);
        }
      }

      const { data: messages, error } = await query;

      if (error) throw error;

      const messageList = (messages || []) as Message[];
      const hasMore = messageList.length > limit;

      if (hasMore) {
        messageList.pop(); // Remove the extra message
      }

      // Return in chronological order (oldest first for display)
      return {
        messages: messageList.reverse(),
        hasMore,
      };
    } catch (error) {
      console.error("Failed to get messages:", error);
      throw error;
    }
  }

  // Subscribe to new messages (real-time)
  static subscribeToMessages(
    groupId: string,
    onNewMessage: (message: Message) => void,
    onError?: (error: Error) => void,
  ) {
    const channel = supabase
      .channel(`messages:${groupId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "Message",
          filter: `groupId=eq.${groupId}`,
        },
        async (payload) => {
          try {
            // Get full message data with author
            const { data: fullMessage, error } = await supabase
              .from("Message")
              .select(
                `
                id,
                groupId,
                userId,
                content,
                createdAt,
                author:Profile(
                  userId,
                  displayName,
                  username,
                  avatarEmoji,
                  avatarColor
                )
              `,
              )
              .eq("id", payload.new.id)
              .single();

            if (error) throw error;
            onNewMessage(fullMessage as Message);
          } catch (error) {
            console.error("Failed to process new message:", error);
            onError?.(error as Error);
          }
        },
      )
      .subscribe();

    return {
      unsubscribe: () => {
        supabase.removeChannel(channel);
      },
    };
  }

  // Typing indicator support
  static async sendTypingIndicator(groupId: string, isTyping: boolean) {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const channel = supabase.channel(`typing:${groupId}`);

      await channel.send({
        type: "broadcast",
        event: "typing",
        payload: {
          userId: user.id,
          isTyping,
          timestamp: Date.now(),
        },
      });
    } catch (error) {
      console.error("Failed to send typing indicator:", error);
    }
  }

  // Subscribe to typing indicators
  static subscribeToTyping(
    groupId: string,
    onTyping: (data: { userId: string; isTyping: boolean }) => void,
  ) {
    const channel = supabase
      .channel(`typing:${groupId}`)
      .on("broadcast", { event: "typing" }, (payload) => {
        onTyping({
          userId: payload.payload.userId,
          isTyping: payload.payload.isTyping,
        });
      })
      .subscribe();

    return {
      unsubscribe: () => {
        supabase.removeChannel(channel);
      },
    };
  }
}
