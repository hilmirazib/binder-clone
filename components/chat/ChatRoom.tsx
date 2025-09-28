"use client";

import { useState, useRef, useEffect } from "react";
import { ArrowUp, Loader2, MessageCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/Avatar";
import { MessageItem } from "./MessageItem";
import { TypingIndicator } from "./TypingIndicator";
import { ChatInput } from "./ChatInput";

import { useMessages } from "@/lib/hooks/useMessages";
import { useTyping } from "@/lib/hooks/useTyping";
import { useAuth } from "@/lib/hooks/useAuth";
import { Message } from "@/lib/services/messageService";

interface ChatRoomProps {
  groupId: string;
  groupName: string;
}

export function ChatRoom({ groupId, groupName }: ChatRoomProps) {
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);

  const {
    messages,
    loading,
    error,
    hasMore,
    sending,
    sendMessage,
    loadMore,
    retry,
  } = useMessages({ groupId });

  const { user } = useAuth();

  const { typingUsers, sendTypingIndicator } = useTyping({ groupId });

  // Check if should show scroll to bottom button
  useEffect(() => {
    const handleScroll = () => {
      if (!messagesContainerRef.current) return;

      const { scrollTop, scrollHeight, clientHeight } =
        messagesContainerRef.current;
      const isNearBottom = scrollTop + clientHeight >= scrollHeight - 100;

      setShowScrollToBottom(!isNearBottom && messages.length > 0);
    };

    const container = messagesContainerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, [messages.length]);

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  };

  // Group consecutive messages from same user
  const groupedMessages = messages.reduce(
    (acc, message, index) => {
      const prevMessage = messages[index - 1];
      const showAvatar = !prevMessage || prevMessage.userId !== message.userId;

      acc.push({
        ...message,
        showAvatar,
      });

      return acc;
    },
    [] as (Message & { showAvatar: boolean })[],
  );

  // Loading state
  if (loading && messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-gray-400" />
          <p className="text-gray-600">Loading messages...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error && messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-red-600 mb-4">Failed to load messages</p>
          <Button onClick={retry} variant="outline">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Messages Container */}
      <div ref={messagesContainerRef} className="flex-1 overflow-y-auto px-4">
        {/* Load More Button */}
        {hasMore && (
          <div className="text-center py-4">
            <Button
              onClick={loadMore}
              variant="ghost"
              size="sm"
              disabled={loading}
              className="text-gray-600"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : null}
              Load Earlier Messages
            </Button>
          </div>
        )}

        {/* Messages */}
        {groupedMessages.length > 0 ? (
          <div className="py-4">
            {groupedMessages.map((message, index) => (
              <MessageItem
                key={message.id}
                message={message}
                isOwn={message.userId === user?.id}
                showAvatar={message.showAvatar}
              />
            ))}
          </div>
        ) : (
          // Empty State
          <div className="flex-1 flex items-center justify-center py-16">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <MessageCircle className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Start Chatting
              </h3>
              <p className="text-gray-600">
                No messages yet. Be the first to send a message!
              </p>
            </div>
          </div>
        )}

        {/* Typing Indicator */}
        <TypingIndicator typingUsers={typingUsers} />
      </div>

      {/* Scroll to Bottom Button */}
      {showScrollToBottom && (
        <div className="absolute bottom-20 right-4">
          <Button
            onClick={scrollToBottom}
            size="sm"
            className="rounded-full w-10 h-10 bg-gray-600 hover:bg-gray-700 shadow-lg"
          >
            <ArrowUp className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Chat Input */}
      <ChatInput
        onSendMessage={sendMessage}
        onTyping={sendTypingIndicator}
        disabled={sending}
      />
    </div>
  );
}
