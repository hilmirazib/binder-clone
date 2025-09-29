"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Save, Eye, FileText, Loader2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { BlockEditor } from "./BlockEditor";

import { NoteService, Note, NoteBlock } from "@/lib/services/noteService";
import { useAuth } from "@/lib/hooks/useAuth";

interface NoteEditorProps {
  groupId: string;
  noteId?: string; // For editing existing note
  onSave?: (note: Note) => void;
  onCancel?: () => void;
}

export function NoteEditor({
  groupId,
  noteId,
  onSave,
  onCancel,
}: NoteEditorProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [note, setNote] = useState<Note | null>(null);
  const [title, setTitle] = useState("");
  const [blocks, setBlocks] = useState<
    Omit<NoteBlock, "id" | "noteId" | "createdAt" | "updatedAt">[]
  >([{ order: 0, type: "text", content: { text: "" } }]);
  const [status, setStatus] = useState<"draft" | "published">("draft");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingNote, setIsLoadingNote] = useState(!!noteId);

  // Load existing note for editing
  useEffect(() => {
    async function loadNote() {
      if (!noteId) return;

      try {
        setIsLoadingNote(true);
        const existingNote = await NoteService.getNoteById(noteId);

        setNote(existingNote);
        setTitle(existingNote.title || "");
        setStatus(existingNote.status);

        if (existingNote.blocks.length > 0) {
          setBlocks(
            existingNote.blocks.map((block) => ({
              order: block.order,
              type: block.type,
              content: block.content,
            })),
          );
        }
      } catch (error) {
        console.error("Failed to load note:", error);
        toast.error("Failed to load note");
        onCancel?.();
      } finally {
        setIsLoadingNote(false);
      }
    }

    loadNote();
  }, [noteId, onCancel]);

  const handleSave = async (publishImmediately = false) => {
    if (!user) return;

    setIsSaving(true);
    try {
      const saveData = {
        title: title.trim() || null,
        status: publishImmediately ? ("published" as const) : status,
        blocks: blocks.filter((block) => {
          // Filter out empty blocks
          if (
            block.type === "text" ||
            block.type === "heading" ||
            block.type === "quote"
          ) {
            return block.content.text?.trim();
          }
          if (block.type === "list") {
            return block.content.items?.some((item) => item.trim());
          }
          return true; // Keep dividers
        }),
      };

      let savedNote: Note;

      if (noteId) {
        // Update existing note
        savedNote = await NoteService.updateNote(noteId, saveData);
        toast.success(publishImmediately ? "Note published!" : "Note saved!");
      } else {
        // Create new note
        savedNote = await NoteService.createNote({
          groupId,
          ...saveData,
        });
        toast.success(
          publishImmediately ? "Note created and published!" : "Note created!",
        );
      }

      setNote(savedNote);
      setStatus(savedNote.status);
      onSave?.(savedNote);
    } catch (error) {
      console.error("Failed to save note:", error);
      toast.error("Failed to save note");
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublish = async () => {
    await handleSave(true);
  };

  if (isLoadingNote) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Loading note...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-10">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onCancel?.() || router.back()}
              className="p-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>

            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-gray-600" />
              <span className="font-medium text-gray-900">
                {noteId ? "Edit Note" : "New Note"}
              </span>
              <Badge variant={status === "published" ? "default" : "secondary"}>
                {status}
              </Badge>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => handleSave()}
              disabled={isSaving}
              size="sm"
            >
              {isSaving ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              Save Draft
            </Button>

            <Button onClick={handlePublish} disabled={isSaving} size="sm">
              {isSaving ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <Eye className="w-4 h-4 mr-2" />
              )}
              {status === "published" ? "Update" : "Publish"}
            </Button>
          </div>
        </div>
      </div>

      {/* Editor Content */}
      <div className="max-w-4xl mx-auto p-6">
        {/* Title Input */}
        <div className="mb-6">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Note title (optional)"
            className="text-2xl font-bold border-none shadow-none px-0 placeholder:text-gray-400"
          />
        </div>

        {/* Block Editor */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <BlockEditor blocks={blocks} onChange={setBlocks} />
        </div>

        {/* Auto-save indicator */}
        {note && (
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-500">
              Last saved: {new Date(note.updatedAt).toLocaleString()}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
