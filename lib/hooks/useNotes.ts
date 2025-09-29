import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { NoteService, Note } from "@/lib/services/noteService";

interface UseNotesOptions {
  groupId: string;
}

export function useNotes({ groupId }: UseNotesOptions) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Load notes
  const loadNotes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const groupNotes = await NoteService.getGroupNotes(groupId);
      setNotes(groupNotes);
    } catch (err) {
      const error = err as Error;
      console.error("Failed to load notes:", error);
      setError(error);
      toast.error("Failed to load notes");
    } finally {
      setLoading(false);
    }
  }, [groupId]);

  // Create note
  const createNote = useCallback(
    async (data: { title?: string; blocks?: any[] }) => {
      try {
        const newNote = await NoteService.createNote({
          groupId,
          title: data.title,
          blocks: data.blocks || [],
        });
        // Notes will be updated via real-time subscription
        return newNote;
      } catch (error) {
        console.error("Failed to create note:", error);
        toast.error("Failed to create note");
        throw error;
      }
    },
    [groupId],
  );

  // Delete note
  const deleteNote = useCallback(async (noteId: string) => {
    try {
      await NoteService.deleteNote(noteId);
      // Notes will be updated via real-time subscription
      toast.success("Note deleted");
    } catch (error) {
      console.error("Failed to delete note:", error);
      toast.error("Failed to delete note");
      throw error;
    }
  }, []);

  // Setup real-time subscription
  useEffect(() => {
    let isMounted = true;

    // Load initial notes
    loadNotes();

    // Setup real-time subscription
    const subscription = NoteService.subscribeToGroupNotes(
      groupId,
      (updatedNotes) => {
        if (!isMounted) return;
        setNotes(updatedNotes);
      },
      (error) => {
        console.error("Notes subscription error:", error);
        toast.error("Connection lost. Notes may not update in real-time.");
      },
    );

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [groupId, loadNotes]);

  return {
    notes,
    loading,
    error,
    createNote,
    deleteNote,
    refresh: loadNotes,
  };
}
