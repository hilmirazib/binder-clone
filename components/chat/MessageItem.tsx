import { Message } from "@/lib/services/messageService";
import { Avatar } from "../ui/Avatar";

interface MessageItemProps {
  message: Message;
  isOwn: boolean;
  showAvatar: boolean;
}

export function MessageItem({ message, isOwn, showAvatar }: MessageItemProps) {
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60),
    );

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;

    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div
      className={`flex gap-3 mb-4 ${isOwn ? "flex-row-reverse" : "flex-row"}`}
    >
      {/* Avatar */}
      {showAvatar && !isOwn && (
        <Avatar
          profile={{
            displayName: message.author.displayName,
            username: message.author.username,
            avatarEmoji: message.author.avatarEmoji,
            avatarColor: message.author.avatarColor,
            avatarUrl: null,
          }}
          size="sm"
          className="flex-shrink-0"
        />
      )}

      {/* Message Content */}
      <div
        className={`flex flex-col ${isOwn ? "items-end" : "items-start"} flex-1`}
      >
        {/* Author Name (for others' messages) */}
        {!isOwn && showAvatar && (
          <span className="text-xs font-medium text-gray-600 mb-1 px-1">
            {message.author.displayName || message.author.username || "Unknown"}
          </span>
        )}

        {/* Message Bubble */}
        <div
          className={`max-w-[280px] px-4 py-2 rounded-2xl break-words ${
            isOwn
              ? "bg-blue-600 text-white rounded-br-md"
              : "bg-gray-100 text-gray-900 rounded-bl-md"
          }`}
        >
          <p className="text-sm leading-relaxed whitespace-pre-wrap">
            {message.content}
          </p>
        </div>

        {/* Timestamp */}
        <span
          className={`text-xs text-gray-500 mt-1 px-1 ${isOwn ? "text-right" : "text-left"}`}
        >
          {formatTime(message.createdAt)}
        </span>
      </div>

      {/* Spacer for own messages */}
      {isOwn && !showAvatar && <div className="w-8 flex-shrink-0" />}
    </div>
  );
}
