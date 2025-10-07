"use client";

import React, { useState, KeyboardEvent } from "react";
import {
  Plus,
  Type,
  List,
  Quote,
  Minus,
  Trash2,
  GripVertical,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { NoteBlock } from "@/lib/services/noteService";

interface BlockEditorProps {
  blocks: Omit<NoteBlock, "id" | "noteId" | "createdAt" | "updatedAt">[];
  onChange: (
    blocks: Omit<NoteBlock, "id" | "noteId" | "createdAt" | "updatedAt">[],
  ) => void;
  readOnly?: boolean;
}

type BlockType = "text" | "heading" | "list" | "quote" | "divider";

export function BlockEditor({
  blocks,
  onChange,
  readOnly = false,
}: BlockEditorProps) {
  const [draggedBlock, setDraggedBlock] = useState<number | null>(null);

  const updateBlock = (
    index: number,
    updates: Partial<
      Omit<NoteBlock, "id" | "noteId" | "createdAt" | "updatedAt">
    >,
  ) => {
    const newBlocks = [...blocks];
    newBlocks[index] = { ...newBlocks[index], ...updates };
    onChange(newBlocks);
  };

  const addBlock = (type: BlockType, afterIndex?: number) => {
    const newBlock: Omit<
      NoteBlock,
      "id" | "noteId" | "createdAt" | "updatedAt"
    > = {
      order: 0, // Will be set by parent
      type,
      content:
        type === "list"
          ? { items: [""] }
          : type === "heading"
            ? { text: "", level: 1 }
            : { text: "" },
    };

    const newBlocks = [...blocks];
    if (afterIndex !== undefined) {
      newBlocks.splice(afterIndex + 1, 0, newBlock);
    } else {
      newBlocks.push(newBlock);
    }

    onChange(newBlocks);
  };

  const removeBlock = (index: number) => {
    const newBlocks = blocks.filter((_, i) => i !== index);
    onChange(newBlocks);
  };

  const moveBlock = (fromIndex: number, toIndex: number) => {
    const newBlocks = [...blocks];
    const [moved] = newBlocks.splice(fromIndex, 1);
    newBlocks.splice(toIndex, 0, moved);
    onChange(newBlocks);
  };

  const handleKeyPress = (
    e: KeyboardEvent,
    index: number,
    blockType: BlockType,
  ) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (blockType === "heading") {
        addBlock("text", index);
      } else if (blockType === "text") {
        addBlock("text", index);
      }
    }
  };

  if (readOnly) {
    return (
      <div className="space-y-4">
        {blocks.map((block, index) => (
          <BlockRenderer key={index} block={block} />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {blocks.map((block, index) => (
        <div
          key={index}
          className="group relative border border-gray-200 rounded-lg p-3 hover:border-gray-300 transition-colors"
          draggable
          onDragStart={() => setDraggedBlock(index)}
          onDragEnd={() => setDraggedBlock(null)}
          onDragOver={(e) => e.preventDefault()}
          onDrop={() => {
            if (draggedBlock !== null && draggedBlock !== index) {
              moveBlock(draggedBlock, index);
            }
          }}
        >
          {/* Drag Handle */}
          <div className="absolute left-1 top-3 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab">
            <GripVertical className="w-4 h-4 text-gray-400" />
          </div>

          {/* Block Content */}
          <div className="ml-6">
            <BlockEditor_Block
              block={block}
              index={index}
              onUpdate={(updates) => updateBlock(index, updates)}
              onKeyPress={(e) => handleKeyPress(e, index, block.type)}
              onAddBlock={(type) => addBlock(type, index)}
              onRemove={() => removeBlock(index)}
            />
          </div>
        </div>
      ))}

      {/* Add Block Button */}
      <div className="flex items-center gap-2 pt-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => addBlock("text")}
          className="text-gray-600"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add block
        </Button>

        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => addBlock("heading")}
            title="Add heading"
          >
            <Type className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => addBlock("list")}
            title="Add list"
          >
            <List className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => addBlock("quote")}
            title="Add quote"
          >
            <Quote className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => addBlock("divider")}
            title="Add divider"
          >
            <Minus className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

// Individual Block Editor Component
interface BlockEditor_BlockProps {
  block: Omit<NoteBlock, "id" | "noteId" | "createdAt" | "updatedAt">;
  index: number;
  onUpdate: (
    updates: Partial<
      Omit<NoteBlock, "id" | "noteId" | "createdAt" | "updatedAt">
    >,
  ) => void;
  onKeyPress: (e: KeyboardEvent) => void;
  onAddBlock: (type: BlockType) => void;
  onRemove: () => void;
}

function BlockEditor_Block({
  block,
  onUpdate,
  onKeyPress,
  onRemove,
}: BlockEditor_BlockProps) {
  const updateContent = (newContent: any) => {
    onUpdate({ content: newContent });
  };

  switch (block.type) {
    case "heading":
      return (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <select
              value={block.content.level || 1}
              onChange={(e) =>
                updateContent({
                  ...block.content,
                  level: parseInt(e.target.value),
                })
              }
              className="text-sm border border-gray-200 rounded px-2 py-1"
            >
              <option value={1}>H1</option>
              <option value={2}>H2</option>
              <option value={3}>H3</option>
            </select>
            <Button
              variant="ghost"
              size="sm"
              onClick={onRemove}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
          <Input
            value={block.content.text || ""}
            onChange={(e) =>
              updateContent({ ...block.content, text: e.target.value })
            }
            onKeyDown={onKeyPress}
            placeholder={`Heading ${block.content.level || 1}`}
            className={`font-bold border-none shadow-none px-0 ${
              block.content.level === 1
                ? "text-2xl"
                : block.content.level === 2
                  ? "text-xl"
                  : "text-lg"
            }`}
          />
        </div>
      );

    case "text":
      return (
        <div className="relative">
          <Textarea
            value={block.content.text || ""}
            onChange={(e) => updateContent({ text: e.target.value })}
            onKeyDown={onKeyPress}
            placeholder="Type something..."
            className="min-h-[60px] resize-none border-none shadow-none px-0"
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={onRemove}
            className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      );

    case "list":
      return (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600">List</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={onRemove}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
          {(block.content.items || [""]).map((item, itemIndex) => (
            <div key={itemIndex} className="flex items-center gap-2">
              <span className="text-gray-400">•</span>
              <Input
                value={item}
                onChange={(e) => {
                  const newItems = [...(block.content.items || [])];
                  newItems[itemIndex] = e.target.value;
                  updateContent({ items: newItems });
                }}
                placeholder="List item"
                className="border-none shadow-none px-0"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    const newItems = [...(block.content.items || [])];
                    newItems.splice(itemIndex + 1, 0, "");
                    updateContent({ items: newItems });
                  }
                }}
              />
              {(block.content.items || []).length > 1 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    const newItems = (block.content.items || []).filter(
                      (_, i) => i !== itemIndex,
                    );
                    updateContent({ items: newItems });
                  }}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              )}
            </div>
          ))}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              const newItems = [...(block.content.items || []), ""];
              updateContent({ items: newItems });
            }}
            className="text-gray-600"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add item
          </Button>
        </div>
      );

    case "quote":
      return (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600">Quote</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={onRemove}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
          <div className="border-l-4 border-gray-300 pl-4">
            <Textarea
              value={block.content.text || ""}
              onChange={(e) => updateContent({ text: e.target.value })}
              placeholder="Quote text..."
              className="italic border-none shadow-none px-0 resize-none"
            />
          </div>
        </div>
      );

    case "divider":
      return (
        <div className="flex items-center justify-between py-2">
          <hr className="flex-1 border-gray-300" />
          <Button
            variant="ghost"
            size="sm"
            onClick={onRemove}
            className="mx-2 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      );

    default:
      return <div>Unsupported block type: {block.type}</div>;
  }
}

// Read-only Block Renderer
function BlockRenderer({
  block,
}: {
  block: Omit<NoteBlock, "id" | "noteId" | "createdAt" | "updatedAt">;
}) {
  switch (block.type) {
    case "heading":
      const level = block.content.level || 1;
      const className = `font-bold ${
        level === 1 ? "text-2xl" : level === 2 ? "text-xl" : "text-lg"
      }`;
      if (level === 1) {
        return <h1 className={className}>{block.content.text || ""}</h1>;
      } else if (level === 2) {
        return <h2 className={className}>{block.content.text || ""}</h2>;
      } else {
        return <h3 className={className}>{block.content.text || ""}</h3>;
      }

    case "text":
      return (
        <p className="leading-relaxed whitespace-pre-wrap">
          {block.content.text || ""}
        </p>
      );

    case "list":
      return (
        <ul className="list-disc list-inside space-y-1">
          {(block.content.items || []).map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      );

    case "quote":
      return (
        <blockquote className="border-l-4 border-gray-300 pl-4 italic text-gray-700">
          {block.content.text || ""}
        </blockquote>
      );

    case "divider":
      return <hr className="border-gray-300 my-4" />;

    default:
      return null;
  }
}
