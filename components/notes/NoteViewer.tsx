"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Edit3,
  Share2,
  Clock,
  FileText,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/Avatar";
import { BlockEditor } from "./BlockEditor";

import { NoteService, Note } from "@/lib/services/noteService";
import { useAuth } from "@/lib/hooks/useAuth";

interface NoteViewerProps {
  noteId: string;
  onEdit?: () => void;
  onBack?: () => void;
}

export function NoteViewer({ noteId, onEdit, onBack }: NoteViewerProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [note, setNote] = useState<Note | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load note
  useEffect(() => {
    async function loadNote() {
      try {
        setIsLoading(true);
        const noteData = await NoteService.getNoteById(noteId);
        setNote(noteData);
      } catch (error) {
        console.error("Failed to load note:", error);
        toast.error("Failed to load note");
        onBack?.();
      } finally {
        setIsLoading(false);
      }
    }

    loadNote();

    // Subscribe to real-time updates
    const subscription = NoteService.subscribeToNote(
      noteId,
      (updatedNote) => {
        setNote(updatedNote);
      },
      (error) => {
        console.error("Note subscription error:", error);
      },
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [noteId, onBack]);

  const handleShare = async () => {
    try {
      const url = `${window.location.origin}/note/${noteId}`;
      await navigator.clipboard.writeText(url);
      toast.success("Note link copied to clipboard!");
    } catch (error) {
      console.error("Failed to copy link:", error);
      toast.error("Failed to copy link");
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Loading note...</span>
        </div>
      </div>
    );
  }

  if (!note) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Note not found
          </h3>
          <p className="text-gray-600 mb-4">
            This note might have been deleted or you don't have access to it.
          </p>
          <Button onClick={onBack || (() => router.back())}>Go Back</Button>
        </div>
      </div>
    );
  }

  const canEdit = note.authorId === user?.id;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={onBack || (() => router.back())}
                className="p-2"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>

              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-gray-600" />
                <Badge
                  variant={
                    note.status === "published" ? "default" : "secondary"
                  }
                >
                  {note.status}
                </Badge>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>

              {canEdit && (
                <Button size="sm" onClick={onEdit}>
                  <Edit3 className="w-4 h-4 mr-2" />
                  Edit
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Note Content */}
      <div className="max-w-4xl mx-auto p-6">
        {/* Title */}
        {note.title && (
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            {note.title}
          </h1>
        )}

        {/* Meta Information */}
        <div className="flex items-center gap-6 text-sm text-gray-600 mb-8 pb-6 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Avatar
              profile={{
                displayName: note.author.displayName,
                username: note.author.username,
                avatarEmoji: note.author.avatarEmoji,
                avatarColor: note.author.avatarColor,
                avatarUrl: null,
              }}
              size="sm"
            />
            <div>
              <p className="font-medium text-gray-900">
                {note.author.displayName || note.author.username || "Unknown"}
              </p>
              {note.author.username && (
                <p className="text-xs text-gray-500">@{note.author.username}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>Created {formatDate(note.createdAt)}</span>
            </div>

            {note.updatedAt !== note.createdAt && (
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>Updated {formatDate(note.updatedAt)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Note Blocks */}
        <div className="bg-white rounded-lg border border-gray-200 p-8">
          {note.blocks.length > 0 ? (
            <BlockEditor
              blocks={note.blocks.map((block) => ({
                order: block.order,
                type: block.type,
                content: block.content,
              }))}
              onChange={() => {}} // Read-only
              readOnly={true}
            />
          ) : (
            <div className="text-center py-12 text-gray-500">
              <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>This note is empty.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
