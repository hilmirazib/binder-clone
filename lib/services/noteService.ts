import { supabase } from "@/lib/supabase";

export interface NoteBlock {
  id: string;
  noteId: string;
  order: number;
  type: "text" | "heading" | "list" | "quote" | "divider";
  content: {
    text?: string;
    level?: number; // for headings (1-3)
    items?: string[]; // for lists
  };
  createdAt: string;
  updatedAt: string;
}

export interface Note {
  id: string;
  groupId: string;
  authorId: string;
  title: string | null;
  status: "draft" | "published";
  createdAt: string;
  updatedAt: string;
  author: {
    userId: string;
    displayName: string | null;
    username: string | null;
    avatarEmoji: string | null;
    avatarColor: string | null;
  };
  blocks: NoteBlock[];
}

export interface CreateNoteData {
  groupId: string;
  title?: string;
  blocks: Omit<NoteBlock, "id" | "noteId" | "createdAt" | "updatedAt">[];
}

export interface UpdateNoteData {
  title?: string;
  status?: "draft" | "published";
  blocks?: Omit<NoteBlock, "id" | "noteId" | "createdAt" | "updatedAt">[];
}

export class NoteService {
  // Create new note
  static async createNote(data: CreateNoteData): Promise<Note> {
    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        throw new Error("User not authenticated");
      }

      // Validate user is group member
      const { data: membership } = await supabase
        .from("GroupMember")
        .select("userId")
        .eq("groupId", data.groupId)
        .eq("userId", user.id)
        .single();

      if (!membership) {
        throw new Error("You are not a member of this group");
      }

      // Create note
      const { data: note, error: noteError } = await supabase
        .from("Note")
        .insert({
          groupId: data.groupId,
          authorId: user.id,
          title: data.title || null,
          status: "draft",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })
        .select(
          `
          id,
          groupId,
          authorId,
          title,
          status,
          createdAt,
          updatedAt,
          author:Profile(
            userId,
            displayName,
            username,
            avatarEmoji,
            avatarColor
          )
        `,
        )
        .single();

      if (noteError) throw noteError;

      // Create note blocks
      if (data.blocks && data.blocks.length > 0) {
        const blocksToInsert = data.blocks.map((block, index) => ({
          noteId: note.id,
          order: index,
          type: block.type,
          content: block.content,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }));

        const { data: blocks, error: blocksError } = await supabase
          .from("NoteBlock")
          .insert(blocksToInsert)
          .select();

        if (blocksError) throw blocksError;

        return {
          ...note,
          blocks: blocks || [],
        } as Note;
      }

      return {
        ...note,
        blocks: [],
      } as Note;
    } catch (error) {
      console.error("Failed to create note:", error);
      throw error;
    }
  }

  // Get note by ID with blocks
  static async getNoteById(noteId: string): Promise<Note> {
    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        throw new Error("User not authenticated");
      }

      // Get note with author info
      const { data: note, error: noteError } = await supabase
        .from("Note")
        .select(
          `
          id,
          groupId,
          authorId,
          title,
          status,
          createdAt,
          updatedAt,
          author:Profile(
            userId,
            displayName,
            username,
            avatarEmoji,
            avatarColor
          )
        `,
        )
        .eq("id", noteId)
        .single();

      if (noteError) throw noteError;

      // Validate user can access this note (must be group member)
      const { data: membership } = await supabase
        .from("GroupMember")
        .select("userId")
        .eq("groupId", note.groupId)
        .eq("userId", user.id)
        .single();

      if (!membership) {
        throw new Error("You do not have access to this note");
      }

      // Get note blocks
      const { data: blocks, error: blocksError } = await supabase
        .from("NoteBlock")
        .select("*")
        .eq("noteId", noteId)
        .order("order", { ascending: true });

      if (blocksError) throw blocksError;

      return {
        ...note,
        blocks: blocks || [],
      } as Note;
    } catch (error) {
      console.error("Failed to get note:", error);
      throw error;
    }
  }

  // Update note
  static async updateNote(noteId: string, data: UpdateNoteData): Promise<Note> {
    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        throw new Error("User not authenticated");
      }

      // Get existing note to check permissions
      const existingNote = await this.getNoteById(noteId);

      if (existingNote.authorId !== user.id) {
        throw new Error("You can only edit your own notes");
      }

      // Update note metadata
      const updateData: any = {
        updatedAt: new Date().toISOString(),
      };

      if (data.title !== undefined) updateData.title = data.title;
      if (data.status !== undefined) updateData.status = data.status;

      const { data: note, error: noteError } = await supabase
        .from("Note")
        .update(updateData)
        .eq("id", noteId)
        .select(
          `
          id,
          groupId,
          authorId,
          title,
          status,
          createdAt,
          updatedAt,
          author:Profile(
            userId,
            displayName,
            username,
            avatarEmoji,
            avatarColor
          )
        `,
        )
        .single();

      if (noteError) throw noteError;

      // Update blocks if provided
      if (data.blocks) {
        // Delete existing blocks
        const { error: deleteError } = await supabase
          .from("NoteBlock")
          .delete()
          .eq("noteId", noteId);

        if (deleteError) throw deleteError;

        // Insert new blocks
        if (data.blocks.length > 0) {
          const blocksToInsert = data.blocks.map((block, index) => ({
            noteId,
            order: index,
            type: block.type,
            content: block.content,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }));

          const { data: blocks, error: blocksError } = await supabase
            .from("NoteBlock")
            .insert(blocksToInsert)
            .select();

          if (blocksError) throw blocksError;

          return {
            ...note,
            blocks: blocks || [],
          } as Note;
        }
      }

      // Return with existing blocks if not updating blocks
      const { data: blocks, error: blocksError } = await supabase
        .from("NoteBlock")
        .select("*")
        .eq("noteId", noteId)
        .order("order", { ascending: true });

      if (blocksError) throw blocksError;

      return {
        ...note,
        blocks: blocks || [],
      } as Note;
    } catch (error) {
      console.error("Failed to update note:", error);
      throw error;
    }
  }

  // Delete note
  static async deleteNote(noteId: string): Promise<void> {
    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        throw new Error("User not authenticated");
      }

      // Check if user can delete (must be author)
      const { data: note } = await supabase
        .from("Note")
        .select("authorId")
        .eq("id", noteId)
        .single();

      if (!note || note.authorId !== user.id) {
        throw new Error("You can only delete your own notes");
      }

      // Delete note (blocks will be cascade deleted)
      const { error } = await supabase.from("Note").delete().eq("id", noteId);

      if (error) throw error;
    } catch (error) {
      console.error("Failed to delete note:", error);
      throw error;
    }
  }

  // Get notes for a group
  static async getGroupNotes(groupId: string): Promise<Note[]> {
    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        throw new Error("User not authenticated");
      }

      // Validate user is group member
      const { data: membership } = await supabase
        .from("GroupMember")
        .select("userId")
        .eq("groupId", groupId)
        .eq("userId", user.id)
        .single();

      if (!membership) {
        throw new Error("You are not a member of this group");
      }

      // Get notes (published notes + own drafts)
      const { data: notes, error } = await supabase
        .from("Note")
        .select(
          `
          id,
          groupId,
          authorId,
          title,
          status,
          createdAt,
          updatedAt,
          author:Profile(
            userId,
            displayName,
            username,
            avatarEmoji,
            avatarColor
          )
        `,
        )
        .eq("groupId", groupId)
        .or(`status.eq.published,authorId.eq.${user.id}`)
        .order("updatedAt", { ascending: false });

      if (error) throw error;

      // Get block counts for each note
      const notesWithBlockInfo = await Promise.all(
        (notes || []).map(async (note) => {
          const { count } = await supabase
            .from("NoteBlock")
            .select("*", { count: "exact", head: true })
            .eq("noteId", note.id);

          return {
            ...note,
            blocks: [],
            blockCount: count || 0,
          };
        }),
      );

      return notesWithBlockInfo as Note[];
    } catch (error) {
      console.error("Failed to get group notes:", error);
      throw error;
    }
  }

  // Subscribe to note changes (real-time)
  static subscribeToNote(
    noteId: string,
    onUpdate: (note: Note) => void,
    onError?: (error: Error) => void,
  ) {
    const channel = supabase
      .channel(`note:${noteId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "Note",
          filter: `id=eq.${noteId}`,
        },
        async (payload) => {
          try {
            const updatedNote = await this.getNoteById(noteId);
            onUpdate(updatedNote);
          } catch (error) {
            console.error("Failed to process note update:", error);
            onError?.(error as Error);
          }
        },
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "NoteBlock",
          filter: `noteId=eq.${noteId}`,
        },
        async (payload) => {
          try {
            const updatedNote = await this.getNoteById(noteId);
            onUpdate(updatedNote);
          } catch (error) {
            console.error("Failed to process note block update:", error);
            onError?.(error as Error);
          }
        },
      )
      .subscribe();

    return {
      unsubscribe: () => {
        supabase.removeChannel(channel);
      },
    };
  }

  // Subscribe to group notes changes
  static subscribeToGroupNotes(
    groupId: string,
    onUpdate: (notes: Note[]) => void,
    onError?: (error: Error) => void,
  ) {
    const channel = supabase
      .channel(`notes:${groupId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "Note",
          filter: `groupId=eq.${groupId}`,
        },
        async (payload) => {
          try {
            const updatedNotes = await this.getGroupNotes(groupId);
            onUpdate(updatedNotes);
          } catch (error) {
            console.error("Failed to process group notes update:", error);
            onError?.(error as Error);
          }
        },
      )
      .subscribe();

    return {
      unsubscribe: () => {
        supabase.removeChannel(channel);
      },
    };
  }
}
