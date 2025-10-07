"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Users,
  MessageCircle,
  StickyNote,
  Settings,
  UserPlus,
  LogOut,
  Loader2,
  Copy,
  Check,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

import { GroupService } from "@/lib/services/groupService";
import { useAuth } from "@/lib/hooks/useAuth";
import { GroupWithMembers } from "@/lib/types/group";
import { ChatRoom } from "@/components/chat/ChatRoom";
import { NotesList } from "@/components/notes/NotesList";
import { NoteEditor } from "@/components/notes/NoteEditor";
import { NoteViewer } from "@/components/notes/NoteViewer";

type ViewMode = "list" | "create" | "edit" | "view";

export default function GroupDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [group, setGroup] = useState<GroupWithMembers | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"chat" | "notes" | "members">(
    "chat",
  );
  const [showLeaveDialog, setShowLeaveDialog] = useState(false);
  const [isLeavingGroup, setIsLeavingGroup] = useState(false);
  const [copiedInvite, setCopiedInvite] = useState(false);

  const [notesViewMode, setNotesViewMode] = useState<ViewMode>("list");
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);

  const groupId = params?.id as string;

  // Load group data
  useEffect(() => {
    async function loadGroup() {
      if (!user || !groupId) return;

      try {
        const groupData = await GroupService.getGroupById(groupId);
        if (!groupData) {
          toast.error("Group not found or you do not have access");
          router.push("/space");
          return;
        }
        setGroup(groupData);
      } catch (error) {
        console.error("Failed to load group:", error);
        toast.error("Failed to load group");
        router.push("/space");
      } finally {
        setIsLoading(false);
      }
    }

    loadGroup();
  }, [user, groupId, router]);

  const handleCreateNote = () => {
    setNotesViewMode("create");
    setSelectedNoteId(null);
  };

  const handleEditNote = (noteId: string) => {
    setNotesViewMode("edit");
    setSelectedNoteId(noteId);
  };

  const handleViewNote = (noteId: string) => {
    setNotesViewMode("view");
    setSelectedNoteId(noteId);
  };

  const handleBackToNotesList = () => {
    setNotesViewMode("list");
    setSelectedNoteId(null);
  };

  const handleNoteSaved = () => {
    setNotesViewMode("list");
    setSelectedNoteId(null);
    toast.success("Note saved successfully!");
  };

  const handleLeaveGroup = async () => {
    if (!user || !group) return;

    setIsLeavingGroup(true);

    try {
      await GroupService.leaveGroup(group.id);
      toast.success("Left group successfully");
      router.push("/space");
    } catch (error) {
      console.error("Failed to leave group:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to leave group",
      );
      setIsLeavingGroup(false);
    }
  };

  const copyInviteCode = async () => {
    if (!group) return;

    try {
      await navigator.clipboard.writeText(group.inviteCode);
      setCopiedInvite(true);
      toast.success("Invite code copied!");
      setTimeout(() => setCopiedInvite(false), 2000);
    } catch (error) {
      toast.error("Failed to copy invite code" + (error as string) || "");
    }
  };

  const isOwner = user && group && group.ownerId === user.id;
  const isAdmin =
    user &&
    group &&
    group.members.some(
      (member) => member.userId === user.id && member.role === "admin",
    );
  const canManage = isOwner || isAdmin;

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Loading group...</span>
        </div>
      </div>
    );
  }

  if (!group) {
    return null;
  }

  if (activeTab === "notes" && notesViewMode !== "list") {
    if (notesViewMode === "create") {
      return (
        <NoteEditor
          groupId={groupId}
          onSave={handleNoteSaved}
          onCancel={handleBackToNotesList}
        />
      );
    }

    if (notesViewMode === "edit" && selectedNoteId) {
      return (
        <NoteEditor
          groupId={groupId}
          noteId={selectedNoteId}
          onSave={handleNoteSaved}
          onCancel={handleBackToNotesList}
        />
      );
    }

    if (notesViewMode === "view" && selectedNoteId) {
      return (
        <NoteViewer
          noteId={selectedNoteId}
          onEdit={() => setNotesViewMode("edit")}
          onBack={handleBackToNotesList}
        />
      );
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-10">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="p-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>

            <Avatar
              profile={{
                displayName: group.name,
                username: null,
                avatarEmoji: group.avatarEmoji,
                avatarColor: group.avatarColor,
                avatarUrl: null,
              }}
              size="sm"
            />

            <div>
              <h1 className="text-lg font-semibold truncate">{group.name}</h1>
              <p className="text-sm text-gray-600">
                {group._count.members}{" "}
                {group._count.members === 1 ? "member" : "members"}
              </p>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <Settings className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={copyInviteCode}>
                {copiedInvite ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Invite Code
                  </>
                )}
              </DropdownMenuItem>

              {canManage && (
                <>
                  <DropdownMenuItem>
                    <UserPlus className="w-4 h-4 mr-2" />
                    Manage Members
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="w-4 h-4 mr-2" />
                    Group Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </>
              )}

              <DropdownMenuItem
                onClick={() => setShowLeaveDialog(true)}
                className="text-red-600 focus:text-red-600"
              >
                <LogOut className="w-4 h-4 mr-2" />
                {isOwner ? "Delete Group" : "Leave Group"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Group Info */}
      {group.description && (
        <div className="bg-white border-b border-gray-200 px-4 py-3">
          <div className="max-w-md mx-auto">
            <p className="text-sm text-gray-700">{group.description}</p>
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-md mx-auto">
          <nav className="flex">
            {[
              {
                key: "chat",
                label: "Chat",
                icon: MessageCircle,
                count: group._count.messages,
              },
              {
                key: "notes",
                label: "Notes",
                icon: StickyNote,
                count: group._count.notes,
              },
              {
                key: "members",
                label: "Members",
                icon: Users,
                count: group._count.members,
              },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-1 border-b-2 transition-colors ${
                  activeTab === tab.key
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span className="text-sm font-medium">{tab.label}</span>
                {tab.count > 0 && (
                  <Badge variant="secondary" className="ml-1 text-xs">
                    {tab.count}
                  </Badge>
                )}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-md mx-auto">
        {activeTab === "chat" && (
          <ChatRoom groupId={groupId} groupName={group.name} />
        )}

        {activeTab === "notes" && (
          <div className="h-full p-4">
            <div className="max-w-6xl mx-auto h-full">
              <NotesList
                groupId={groupId}
                onCreateNote={handleCreateNote}
                onEditNote={handleEditNote}
                onViewNote={handleViewNote}
              />
            </div>
          </div>
        )}

        {activeTab === "members" && (
          <div className="p-4">
            <div className="space-y-3">
              {group.members.map((member) => (
                <div
                  key={member.userId}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <Avatar
                      profile={{
                        displayName: member.user.displayName,
                        username: member.user.username,
                        avatarEmoji: member.user.avatarEmoji,
                        avatarColor: member.user.avatarColor,
                        avatarUrl: null,
                      }}
                      size="md"
                    />
                    <div>
                      <p className="font-medium text-gray-900">
                        {member.user.displayName ||
                          member.user.username ||
                          "Unknown User"}
                      </p>
                      {member.user.username && (
                        <p className="text-sm text-gray-600">
                          @{member.user.username}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {member.role === "owner" && (
                      <Badge variant="default">Owner</Badge>
                    )}
                    {member.role === "admin" && (
                      <Badge variant="secondary">Admin</Badge>
                    )}
                    {member.userId === user?.id && (
                      <Badge variant="outline">You</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Leave Group Dialog */}
      <AlertDialog open={showLeaveDialog} onOpenChange={setShowLeaveDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {isOwner ? "Delete Group?" : "Leave Group?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {isOwner
                ? `Are you sure you want to delete "${group.name}"? This action cannot be undone and all messages and notes will be lost.`
                : `Are you sure you want to leave "${group.name}"? You'll need an invite code to join again.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLeavingGroup}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleLeaveGroup}
              disabled={isLeavingGroup}
              className="bg-red-600 hover:bg-red-700"
            >
              {isLeavingGroup ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {isOwner ? "Deleting..." : "Leaving..."}
                </div>
              ) : isOwner ? (
                "Delete Group"
              ) : (
                "Leave Group"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
