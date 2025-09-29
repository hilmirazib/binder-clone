"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  FileText,
  Eye,
  Edit3,
  Trash2,
  Clock,
  User,
  Search,
  Filter,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/Avatar";

import { NoteService, Note } from "@/lib/services/noteService";
import { useAuth } from "@/lib/hooks/useAuth";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface NotesListProps {
  groupId: string;
  onCreateNote?: () => void;
  onEditNote?: (noteId: string) => void;
  onViewNote?: (noteId: string) => void;
}

export function NotesList({
  groupId,
  onCreateNote,
  onEditNote,
  onViewNote,
}: NotesListProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "published" | "draft"
  >("all");

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Load notes
  useEffect(() => {
    async function loadNotes() {
      try {
        setIsLoading(true);
        const groupNotes = await NoteService.getGroupNotes(groupId);
        setNotes(groupNotes);
        setFilteredNotes(groupNotes);
      } catch (error) {
        console.error("Failed to load notes:", error);
        toast.error("Failed to load notes");
      } finally {
        setIsLoading(false);
      }
    }

    loadNotes();

    // Subscribe to real-time updates
    const subscription = NoteService.subscribeToGroupNotes(
      groupId,
      (updatedNotes) => {
        setNotes(updatedNotes);
        applyFilters(updatedNotes, searchQuery, statusFilter);
      },
      (error) => {
        console.error("Notes subscription error:", error);
      },
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [groupId]);

  // Apply filters
  const applyFilters = (notesList: Note[], search: string, status: string) => {
    let filtered = notesList;

    // Search filter
    if (search.trim()) {
      filtered = filtered.filter(
        (note) =>
          note.title?.toLowerCase().includes(search.toLowerCase()) ||
          note.author.displayName
            ?.toLowerCase()
            .includes(search.toLowerCase()) ||
          note.author.username?.toLowerCase().includes(search.toLowerCase()),
      );
    }

    // Status filter
    if (status !== "all") {
      filtered = filtered.filter((note) => note.status === status);
    }

    setFilteredNotes(filtered);
  };

  // Handle search
  useEffect(() => {
    applyFilters(notes, searchQuery, statusFilter);
  }, [notes, searchQuery, statusFilter]);

  const reapply = (nextNotes: Note[]) => {
    setNotes(nextNotes);
    applyFilters(nextNotes, searchQuery, statusFilter);
  };

  const askDelete = (noteId: string) => {
    setDeletingId(noteId);
    setConfirmOpen(true);
  };

  const confirmDelete = async (noteId: string) => {
    if (!deletingId) return;
    setIsDeleting(true);

    const prevNotes = notes;

    const next = prevNotes.filter((n) => n.id !== deletingId);
    reapply(next);
    try {
      await NoteService.deleteNote(deletingId);
      toast.success("Note deleted");
    } catch (err) {
      console.error("Failed to delete note:", err);
      reapply(prevNotes);
      toast.error("Failed to delete note");
    } finally {
      setIsDeleting(false);
      setConfirmOpen(false);
      setDeletingId(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60),
    );

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center gap-2">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Loading notes...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header with Search and Filters */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search notes..."
              className="pl-10"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="border border-gray-200 rounded-md px-3 py-2 text-sm"
          >
            <option value="all">All Notes</option>
            <option value="published">Published</option>
            <option value="draft">Drafts</option>
          </select>

          <Button onClick={onCreateNote} size="sm">
            <Plus className="w-4 h-4 mr-2" />
            New Note
          </Button>
        </div>
      </div>

      {/* Notes List */}
      {filteredNotes.length === 0 ? (
        <div className="text-center py-12">
          {notes.length === 0 ? (
            // No notes at all
            <div>
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No notes yet
              </h3>
              <p className="text-gray-600 mb-4">
                Create your first collaborative note to get started.
              </p>
              <Button onClick={onCreateNote}>
                <Plus className="w-4 h-4 mr-2" />
                Create Note
              </Button>
            </div>
          ) : (
            // No notes match filters
            <div>
              <p className="text-gray-600">
                No notes match your search criteria.
              </p>
              <Button
                variant="ghost"
                onClick={() => {
                  setSearchQuery("");
                  setStatusFilter("all");
                }}
                className="mt-2"
              >
                Clear filters
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredNotes.map((note) => (
            <div
              key={note.id}
              className="bg-white rounded-lg border border-gray-200 p-4 hover:border-gray-300 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  {/* Note Title */}
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-medium text-gray-900 truncate">
                      {note.title || "Untitled Note"}
                    </h3>
                    <Badge
                      variant={
                        note.status === "published" ? "default" : "secondary"
                      }
                    >
                      {note.status}
                    </Badge>
                  </div>

                  {/* Author and Date */}
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                    <div className="flex items-center gap-2">
                      <Avatar
                        profile={{
                          displayName: note.author.displayName,
                          username: note.author.username,
                          avatarEmoji: note.author.avatarEmoji,
                          avatarColor: note.author.avatarColor,
                          avatarUrl: null,
                        }}
                        size="xs"
                      />
                      <span>
                        {note.author.displayName ||
                          note.author.username ||
                          "Unknown"}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{formatDate(note.updatedAt)}</span>
                    </div>

                    {(note as any).blockCount > 0 && (
                      <div className="flex items-center gap-1">
                        <FileText className="w-3 h-3" />
                        <span>{(note as any).blockCount} blocks</span>
                      </div>
                    )}
                  </div>

                  {/* Preview Text */}
                  {note.blocks.length > 0 && (
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {note.blocks
                        .filter(
                          (block) => block.content.text || block.content.items,
                        )
                        .map(
                          (block) =>
                            block.content.text ||
                            (block.content.items &&
                              block.content.items.join(", ")),
                        )
                        .join(" ")
                        .substring(0, 150)}
                      ...
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 ml-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onViewNote?.(note.id)}
                    title="View note"
                  >
                    <Eye className="w-4 h-4" />
                  </Button>

                  {note.authorId === user?.id && (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEditNote?.(note.id)}
                        title="Edit note"
                      >
                        <Edit3 className="w-4 h-4" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => askDelete(note.id)}
                        title="Delete note"
                        className="text-red-600 hover:text-red-700"
                        disabled={isDeleting && deletingId === note.id}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <AlertDialog
        open={confirmOpen}
        onOpenChange={(o) => {
          // cegah menutup saat proses delete
          if (!isDeleting) setConfirmOpen(o);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this note?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The note will be permanently removed
              for all group members.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={isDeleting}
              onClick={() => setConfirmOpen(false)}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" /> Deleting…
                </span>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
