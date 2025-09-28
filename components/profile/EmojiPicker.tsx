import { useState } from "react";
import { Search, Palette } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const emojiCategories = {
  Smileys: [
    "😀",
    "😃",
    "😄",
    "😁",
    "😆",
    "😅",
    "🤣",
    "😂",
    "🙂",
    "🙃",
    "😉",
    "😊",
    "😇",
    "🥰",
    "😍",
    "🤩",
    "😘",
    "😗",
    "😚",
    "😙",
    "😋",
    "😛",
    "😜",
    "🤪",
    "😝",
    "🤑",
    "🤗",
    "🤭",
    "🤫",
    "🤔",
    "🤐",
    "🤨",
    "😐",
    "😑",
    "😶",
    "😏",
    "😒",
    "🙄",
    "😬",
    "🤥",
    "😔",
    "😪",
    "🤤",
    "😴",
    "😷",
    "🤒",
    "🤕",
    "🤢",
    "🤮",
    "🤧",
    "🥵",
    "🥶",
  ],
  People: [
    "👶",
    "🧒",
    "👦",
    "👧",
    "🧑",
    "👱",
    "👨",
    "🧔",
    "👩",
    "🧓",
    "👴",
    "👵",
    "🙍",
    "🙎",
    "🙅",
    "🙆",
    "💁",
    "🙋",
    "🧏",
    "🙇",
    "🤦",
    "🤷",
    "👮",
    "🕵️",
    "💂",
    "👷",
    "🤴",
    "👸",
    "👳",
    "👲",
    "🧕",
    "🤵",
    "👰",
    "🤰",
    "🤱",
    "👼",
    "🎅",
    "🤶",
    "🦸",
    "🦹",
    "🧙",
    "🧚",
    "🧛",
    "🧜",
    "🧝",
    "🧞",
    "🧟",
    "💆",
    "💇",
    "🚶",
    "🏃",
    "💃",
  ],
  Animals: [
    "🐶",
    "🐱",
    "🐭",
    "🐹",
    "🐰",
    "🦊",
    "🐻",
    "🐼",
    "🐨",
    "🐯",
    "🦁",
    "🐸",
    "🐵",
    "🐔",
    "🐧",
    "🐦",
    "🐤",
    "🐣",
    "🐥",
    "🦆",
    "🦅",
    "🦉",
    "🦇",
    "🐺",
    "🐗",
    "🐴",
    "🦄",
    "🐝",
    "🐛",
    "🦋",
    "🐌",
    "🐞",
    "🐜",
    "🦟",
    "🦗",
    "🕷️",
    "🦂",
    "🐢",
    "🐍",
    "🦎",
    "🦖",
    "🦕",
    "🐙",
    "🦑",
    "🦐",
    "🦞",
    "🦀",
    "🐡",
    "🐠",
    "🐟",
    "🐬",
    "🐳",
  ],
  Food: [
    "🍎",
    "🍐",
    "🍊",
    "🍋",
    "🍌",
    "🍉",
    "🍇",
    "🍓",
    "🫐",
    "🍈",
    "🍒",
    "🍑",
    "🥭",
    "🍍",
    "🥥",
    "🥝",
    "🍅",
    "🍆",
    "🥑",
    "🥦",
    "🥬",
    "🥒",
    "🌶️",
    "🫑",
    "🌽",
    "🥕",
    "🫒",
    "🧄",
    "🧅",
    "🥔",
    "🍠",
    "🥐",
    "🥯",
    "🍞",
    "🥖",
    "🥨",
    "🧀",
    "🥚",
    "🍳",
    "🧈",
    "🥞",
    "🧇",
    "🥓",
    "🥩",
    "🍗",
    "🍖",
    "🌭",
    "🍔",
    "🍟",
    "🍕",
    "🫓",
    "🥪",
  ],
  Activities: [
    "⚽",
    "🏀",
    "🏈",
    "⚾",
    "🥎",
    "🎾",
    "🏐",
    "🏉",
    "🥏",
    "🎱",
    "🪀",
    "🏓",
    "🏸",
    "🏒",
    "🏑",
    "🥍",
    "🏏",
    "🪃",
    "🥅",
    "⛳",
    "🪁",
    "🏹",
    "🎣",
    "🤿",
    "🥊",
    "🥋",
    "🎽",
    "🛹",
    "🛷",
    "⛸️",
    "🥌",
    "🎿",
    "⛷️",
    "🏂",
    "🪂",
    "🏋️",
    "🤼",
    "🤸",
    "⛹️",
    "🤺",
    "🤾",
    "🏌️",
    "🧘",
    "🏄",
    "🏊",
    "🤽",
    "🚣",
    "🧗",
    "🚵",
    "🚴",
    "🏇",
    "🤹",
  ],
  Objects: [
    "⌚",
    "📱",
    "📲",
    "💻",
    "⌨️",
    "🖥️",
    "🖨️",
    "🖱️",
    "🖲️",
    "🕹️",
    "🗜️",
    "💽",
    "💾",
    "💿",
    "📀",
    "📼",
    "📷",
    "📸",
    "📹",
    "🎥",
    "📽️",
    "🎞️",
    "📞",
    "☎️",
    "📟",
    "📠",
    "📺",
    "📻",
    "🎙️",
    "🎚️",
    "🎛️",
    "🧭",
    "⏱️",
    "⏲️",
    "⏰",
    "🕰️",
    "⌛",
    "⏳",
    "📡",
    "🔋",
    "🔌",
    "💡",
    "🔦",
    "🕯️",
    "🪔",
    "🧯",
    "🛢️",
    "💸",
    "💵",
    "💴",
    "💶",
  ],
};

const presetColors = [
  "#6366F1",
  "#EC4899",
  "#F59E0B",
  "#10B981",
  "#EF4444",
  "#8B5CF6",
  "#06B6D4",
  "#84CC16",
  "#F97316",
  "#6B7280",
];

interface EmojiPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (emoji: string, color: string) => void;
  selectedEmoji?: string;
  selectedColor?: string;
}

export function EmojiPicker({
  isOpen,
  onClose,
  onSelect,
  selectedEmoji = "😊",
  selectedColor = "#6366F1",
}: EmojiPickerProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("Smileys");
  const [currentColor, setCurrentColor] = useState(selectedColor);
  const [currentEmoji, setCurrentEmoji] = useState(selectedEmoji);

  const filteredEmojis = searchTerm
    ? Object.values(emojiCategories)
        .flat()
        .filter((emoji) => emoji.includes(searchTerm.toLowerCase()))
    : emojiCategories[activeCategory as keyof typeof emojiCategories] || [];

  const handleEmojiClick = (emoji: string) => {
    setCurrentEmoji(emoji);
  };

  const handleColorClick = (color: string) => {
    setCurrentColor(color);
  };

  const handleDone = () => {
    onSelect(currentEmoji, currentColor);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Palette className="w-5 h-5" />
            Pick background color & emoji
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Avatar Preview */}
          <div className="flex justify-center">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center text-3xl transition-all duration-200"
              style={{ backgroundColor: currentColor }}
            >
              {currentEmoji}
            </div>
          </div>

          {/* Color Picker */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">
              Background Color
            </p>
            <div className="flex justify-center gap-2 flex-wrap">
              {presetColors.map((color) => (
                <button
                  key={color}
                  onClick={() => handleColorClick(color)}
                  className={`w-8 h-8 rounded-full border-2 transition-all duration-200 hover:scale-110 ${
                    currentColor === color
                      ? "border-gray-800 scale-110"
                      : "border-gray-200 hover:border-gray-400"
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search emoji..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Categories */}
          {!searchTerm && (
            <div className="flex flex-wrap gap-1">
              {Object.keys(emojiCategories).map((category) => (
                <Badge
                  key={category}
                  variant={
                    activeCategory === category ? "default" : "secondary"
                  }
                  className="cursor-pointer hover:bg-gray-200 transition-colors text-xs"
                  onClick={() => setActiveCategory(category)}
                >
                  {category}
                </Badge>
              ))}
            </div>
          )}

          {/* Emoji Grid */}
          <div className="grid grid-cols-8 gap-2 max-h-48 overflow-y-auto p-2">
            {filteredEmojis.map((emoji, index) => (
              <button
                key={index}
                onClick={() => handleEmojiClick(emoji)}
                className={`w-8 h-8 text-xl hover:bg-gray-100 rounded transition-all duration-150 ${
                  currentEmoji === emoji
                    ? "bg-blue-100 ring-2 ring-blue-500 scale-110"
                    : "hover:scale-105"
                }`}
              >
                {emoji}
              </button>
            ))}
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleDone} className="flex-1">
              Done
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
