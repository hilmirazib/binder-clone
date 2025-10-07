"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, Palette } from "lucide-react";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar } from "@/components/ui/Avatar";
import { EmojiPicker } from "@/components/profile/EmojiPicker";

import { GroupService } from "@/lib/services/groupService";

const createGroupSchema = z.object({
  name: z
    .string()
    .min(2, "Group name must be at least 2 characters")
    .max(50, "Group name too long"),
  description: z.string().max(200, "Description too long").optional(),
  avatarEmoji: z.string().optional(),
  avatarColor: z.string().optional(),
  isPublic: z.boolean().optional(),
});

type CreateGroupForm = z.infer<typeof createGroupSchema>;

interface CreateGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGroupCreated: (group: any) => void;
}

export function CreateGroupModal({
  isOpen,
  onClose,
  onGroupCreated,
}: CreateGroupModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const form = useForm<CreateGroupForm>({
    resolver: zodResolver(createGroupSchema),
    defaultValues: {
      name: "",
      description: "",
      avatarEmoji: "👥",
      avatarColor: "#6366F1",
      isPublic: false,
    },
  });

  const onSubmit = async (data: CreateGroupForm) => {
    setIsLoading(true);

    try {
      const newGroup = await GroupService.createGroup(data);
      onGroupCreated(newGroup);
      form.reset();
      toast.success("Group created successfully!");
    } catch (error) {
      console.error("Failed to create group:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to create group",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmojiSelect = (emoji: string, color: string) => {
    form.setValue("avatarEmoji", emoji);
    form.setValue("avatarColor", color);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Group</DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Group Avatar Preview */}
          <div className="text-center">
            <div className="relative inline-block">
              <Avatar
                profile={{
                  displayName: form.watch("name") || "New Group",
                  username: null,
                  avatarEmoji: form.watch("avatarEmoji") || null,
                  avatarColor: form.watch("avatarColor") || null,
                  avatarUrl: null,
                }}
                size="xl"
                className="cursor-pointer hover:opacity-80 transition-opacity"
              />
              <button
                type="button"
                onClick={() => setShowEmojiPicker(true)}
                className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-1 hover:bg-blue-700 transition-colors"
              >
                <Palette className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Group Name */}
          <div>
            <Label htmlFor="name">Group Name *</Label>
            <Input
              id="name"
              {...form.register("name")}
              placeholder="Enter group name"
              disabled={isLoading}
            />
            {form.formState.errors.name && (
              <p className="text-sm text-red-600 mt-1">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea
              id="description"
              {...form.register("description")}
              placeholder="What's this group about?"
              rows={3}
              maxLength={200}
              disabled={isLoading}
            />
            <p className="text-xs text-gray-500 mt-1">
              {form.watch("description")?.length || 0}/200
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={isLoading || !form.watch("name")}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating...
                </div>
              ) : (
                "Create"
              )}
            </Button>
          </div>
        </form>

        {/* Emoji Picker */}
        <EmojiPicker
          isOpen={showEmojiPicker}
          onClose={() => setShowEmojiPicker(false)}
          onSelect={handleEmojiSelect}
          selectedEmoji={form.watch("avatarEmoji")}
          selectedColor={form.watch("avatarColor")}
        />
      </DialogContent>
    </Dialog>
  );
}
