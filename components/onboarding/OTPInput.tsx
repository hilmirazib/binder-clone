import { useRef, useEffect, KeyboardEvent } from "react";
import { cn } from "@/lib/utils";

interface OTPInputProps {
  value: string;
  onChange: (value: string) => void;
  length: number;
  error?: boolean;
}

export function OTPInput({ value, onChange, length, error }: OTPInputProps) {
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputs.current[0]?.focus();
  }, []);

  const handleChange = (index: number, digit: string) => {
    if (digit.length > 1) return;

    const newValue = value.split("");
    newValue[index] = digit;
    onChange(newValue.join(""));

    if (digit && index < length - 1) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (!value[index] && index > 0) {
        inputs.current[index - 1]?.focus();
      } else {
        const newValue = value.split("");
        newValue[index] = "";
        onChange(newValue.join(""));
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const paste = e.clipboardData.getData("text").replace(/\D/g, "");
    if (paste.length <= length) {
      onChange(paste.padEnd(length, "").slice(0, length));
    }
  };

  return (
    <div className="flex justify-center gap-3">
      {Array.from({ length }, (_, index) => (
        <input
          key={index}
          ref={(el) => (inputs.current[index] = el)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[index] || ""}
          onChange={(e) =>
            handleChange(index, e.target.value.replace(/\D/g, ""))
          }
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          className={cn(
            "w-12 h-12 border-2 rounded-lg text-center text-lg font-semibold",
            "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
            "transition-all duration-200",
            error
              ? "border-red-500 bg-red-50"
              : value[index]
                ? "border-blue-500 bg-blue-50"
                : "border-gray-300 bg-white hover:border-gray-400",
          )}
        />
      ))}
    </div>
  );
}
