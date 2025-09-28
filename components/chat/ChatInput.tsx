import { useState, useRef, KeyboardEvent } from "react";
import { Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ChatInputProps {
  onSendMessage: (content: string) => Promise<void>;
  onTyping?: (isTyping: boolean) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function ChatInput({
  onSendMessage,
  onTyping,
  disabled = false,
  placeholder = "Type a message...",
}: ChatInputProps) {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleSend = async () => {
    if (!message.trim() || isLoading || disabled) return;

    const content = message.trim();
    setMessage("");
    setIsLoading(true);

    // Stop typing indicator
    onTyping?.(false);

    try {
      await onSendMessage(content);
      // Focus back to input
      inputRef.current?.focus();
    } catch (error) {
      console.error("Failed to send message:", error);
      // Restore message on failure
      setMessage(content);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (value: string) => {
    setMessage(value);

    // Handle typing indicator
    if (value.trim() && onTyping) {
      onTyping(true);

      // Clear existing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      // Set new timeout to stop typing
      typingTimeoutRef.current = setTimeout(() => {
        onTyping(false);
      }, 2000);
    } else if (!value.trim() && onTyping) {
      onTyping(false);
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t border-gray-200 bg-white p-4">
      <div className="flex items-end gap-3 max-w-md mx-auto">
        <div className="flex-1">
          <Input
            ref={inputRef}
            value={message}
            onChange={(e) => handleInputChange(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder={placeholder}
            disabled={disabled || isLoading}
            maxLength={2000}
            className="resize-none"
          />

          {/* Character count */}
          {message.length > 1800 && (
            <p className="text-xs text-gray-500 mt-1 text-right">
              {message.length}/2000
            </p>
          )}
        </div>

        <Button
          onClick={handleSend}
          disabled={!message.trim() || isLoading || disabled}
          size="sm"
          className="px-3 py-2"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </Button>
      </div>
    </div>
  );
}
