"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, Users, Eye, EyeOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar } from "@/components/ui/Avatar";

import { GroupService } from "@/lib/services/groupService";
import { joinGroupSchema, JoinGroupForm } from "@/lib/validations/groupSchema";
import { useAuth } from "@/lib/hooks/useAuth";
import { GroupWithMembers, GroupPreview } from "@/lib/types/group";
import { useDebounce } from "@/lib/hooks/useDebounce";

interface JoinGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGroupJoined: (group: GroupWithMembers) => void;
}

export function JoinGroupModal({
  isOpen,
  onClose,
  onGroupJoined,
}: JoinGroupModalProps) {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const [groupPreview, setGroupPreview] = useState<GroupPreview | null>(null);
  const [previewError, setPreviewError] = useState<string | null>(null);

  const form = useForm<JoinGroupForm>({
    resolver: zodResolver(joinGroupSchema),
    defaultValues: {
      inviteCode: "",
    },
  });

  const watchedInviteCode = form.watch("inviteCode");
  const debouncedInviteCode = useDebounce(watchedInviteCode, 500);

  // Preview group when invite code is entered
  React.useEffect(() => {
    async function previewGroup() {
      if (!debouncedInviteCode || debouncedInviteCode.length !== 8) {
        setGroupPreview(null);
        setPreviewError(null);
        return;
      }

      setIsPreviewLoading(true);
      setPreviewError(null);

      try {
        const preview = await GroupService.getInviteInfo(debouncedInviteCode);
        setGroupPreview(preview);
      } catch (error) {
        setPreviewError("Invalid invite code");
        setGroupPreview(null);
      } finally {
        setIsPreviewLoading(false);
      }
    }

    previewGroup();
  }, [debouncedInviteCode]);

  const onSubmit = async (data: JoinGroupForm) => {
    if (!user) return;

    setIsLoading(true);

    try {
      const joinedGroup = await GroupService.joinGroupByInvite(
        data.inviteCode,
        user.id,
      );

      // Get full group data after joining
      const fullGroupData = await GroupService.getGroupById(
        joinedGroup.id,
        user.id,
      );
      if (fullGroupData) {
        onGroupJoined(fullGroupData);
      }

      form.reset();
      onClose();
    } catch (error) {
      console.error("Failed to join group:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to join group",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      form.reset();
      setGroupPreview(null);
      setPreviewError(null);
      onClose();
    }
  };

  const formatInviteCode = (value: string) => {
    // Remove non-alphanumeric characters and convert to uppercase
    return value.replace(/[^A-Z0-9]/g, "").slice(0, 8);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Join Group</DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Invite Code Input */}
          <div>
            <Label htmlFor="inviteCode">Invite Code</Label>
            <Input
              id="inviteCode"
              {...form.register("inviteCode")}
              placeholder="Enter 8-character code"
              className="mt-1 font-mono tracking-wider"
              maxLength={8}
              disabled={isLoading}
              onChange={(e) => {
                const formatted = formatInviteCode(
                  e.target.value.toUpperCase(),
                );
                form.setValue("inviteCode", formatted);
              }}
            />
            <p className="text-sm text-gray-600 mt-1">
              Ask a group member for the invite code
            </p>
            {form.formState.errors.inviteCode && (
              <p className="text-sm text-red-600 mt-1">
                {form.formState.errors.inviteCode.message}
              </p>
            )}
          </div>

          {/* Group Preview */}
          {isPreviewLoading && (
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-center">
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                <span className="text-sm text-gray-600">
                  Loading group preview...
                </span>
              </div>
            </div>
          )}

          {previewError && (
            <div className="border border-red-200 bg-red-50 rounded-lg p-4">
              <p className="text-sm text-red-600 text-center">{previewError}</p>
            </div>
          )}

          {groupPreview && (
            <div className="border border-green-200 bg-green-50 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                <Avatar
                  profile={{
                    display_name: groupPreview.name,
                    username: null,
                    avatar_emoji: groupPreview.avatarEmoji,
                    avatar_color: groupPreview.avatarColor,
                    avatar_url: null,
                  }}
                  size="lg"
                />
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">
                    {groupPreview.name}
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{groupPreview._count.members} members</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {groupPreview.isPublic ? (
                        <>
                          <Eye className="w-4 h-4" />
                          <span>Public</span>
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-4 h-4" />
                          <span>Private</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {groupPreview.description && (
                <p className="text-sm text-gray-700 mb-3">
                  {groupPreview.description}
                </p>
              )}

              <p className="text-sm text-gray-600">
                Created by{" "}
                <span className="font-medium">
                  {groupPreview.owner.displayName ||
                    groupPreview.owner.username}
                </span>
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={isLoading || !groupPreview}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Joining...
                </div>
              ) : (
                "Join Group"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
