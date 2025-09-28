import { useEffect, useState } from "react";
import { Avatar } from "@/components/ui/Avatar";

interface TypingUser {
  userId: string;
  displayName: string | null;
  username: string | null;
  avatarEmoji: string | null;
  avatarColor: string | null;
}

interface TypingIndicatorProps {
  typingUsers: TypingUser[];
}

export function TypingIndicator({ typingUsers }: TypingIndicatorProps) {
  const [dots, setDots] = useState("");

  // Animated dots effect
  useEffect(() => {
    if (typingUsers.length === 0) return;

    const interval = setInterval(() => {
      setDots((prev) => {
        if (prev === "...") return ".";
        return prev + ".";
      });
    }, 500);

    return () => clearInterval(interval);
  }, [typingUsers.length]);

  if (typingUsers.length === 0) {
    return null;
  }

  const getTypingText = () => {
    if (typingUsers.length === 1) {
      const user = typingUsers[0];
      const name = user.displayName || user.username || "Someone";
      return `${name} is typing${dots}`;
    } else if (typingUsers.length === 2) {
      const names = typingUsers.map(
        (u) => u.displayName || u.username || "Someone",
      );
      return `${names[0]} and ${names[1]} are typing${dots}`;
    } else {
      return `${typingUsers.length} people are typing${dots}`;
    }
  };

  return (
    <div className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600">
      {/* Show avatars for up to 3 typing users */}
      <div className="flex -space-x-1">
        {typingUsers.slice(0, 3).map((user) => (
          <Avatar
            key={user.userId}
            profile={{
              displayName: user.displayName,
              username: user.username,
              avatarEmoji: user.avatarEmoji,
              avatarColor: user.avatarColor,
              avatarUrl: null,
            }}
            size="xs"
            className="border-2 border-white"
          />
        ))}
      </div>

      {/* Typing text */}
      <span className="italic">{getTypingText()}</span>
    </div>
  );
}
