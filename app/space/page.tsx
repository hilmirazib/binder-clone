"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Users, MessageCircle, StickyNote, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/Avatar";
import { CreateGroupModal } from "@/components/groups/CreateGroupModal";
import { JoinGroupModal } from "@/components/groups/JoinGroupModal";

import { GroupService } from "@/lib/services/groupService";
import { useAuth } from "@/lib/hooks/useAuth";

interface SimpleGroup {
  id: string;
  name: string;
  description?: string;
  avatarEmoji?: string;
  avatarColor?: string;
  inviteCode: string;
  ownerId: string;
  createdAt: string;
  memberCount?: number;
  lastMessage?: {
    content: string;
    authorName: string;
    createdAt: string;
  };
}

export default function SpacePage() {
  const router = useRouter();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [groups, setGroups] = useState<SimpleGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);

  // Load user groups
  useEffect(() => {
    async function loadGroups() {
      if (!isAuthenticated || !user) return;

      try {
        const userGroups = await GroupService.getUserGroups();
        setGroups(userGroups);
      } catch (error) {
        console.error("Failed to load groups:", error);
        toast.error("Failed to load your groups");
      } finally {
        setIsLoading(false);
      }
    }

    if (!authLoading) {
      loadGroups();
    }
  }, [user, isAuthenticated, authLoading]);

  const handleGroupCreated = (newGroup: SimpleGroup) => {
    setGroups((prev) => [newGroup, ...prev]);
    setShowCreateModal(false);
    router.push(`/space/${newGroup.id}`);
  };

  const handleGroupJoined = (joinedGroup: SimpleGroup) => {
    setGroups((prev) => [joinedGroup, ...prev]);
    setShowJoinModal(false);
    router.push(`/space/${joinedGroup.id}`);
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60),
    );

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d`;

    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Loading groups...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <h1 className="text-lg font-semibold">Space</h1>
          <span className="text-sm text-gray-600">
            {groups.length} {groups.length === 1 ? "group" : "groups"}
          </span>
        </div>
      </div>

      <div className="max-w-md mx-auto">
        {groups.length === 0 ? (
          // Empty State
          <div className="flex flex-col items-center justify-center py-16 px-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Users className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No groups yet
            </h3>
            <p className="text-gray-600 text-center mb-6">
              Create your first group to start chatting and collaborating.
            </p>
            <div className="flex gap-3">
              <Button onClick={() => setShowCreateModal(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create Group
              </Button>
              <Button variant="outline" onClick={() => setShowJoinModal(true)}>
                Join Group
              </Button>
            </div>
          </div>
        ) : (
          // Groups List
          <div className="bg-white mx-4 mt-4 rounded-lg shadow-sm overflow-hidden">
            <ul className="divide-y divide-gray-100">
              {groups.map((group) => (
                <li key={group.id}>
                  <button
                    onClick={() => router.push(`/space/${group.id}`)}
                    className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors text-left"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <Avatar
                        profile={{
                          display_name: group.name,
                          username: null,
                          avatar_emoji: group.avatarEmoji,
                          avatar_color: group.avatarColor,
                          avatar_url: null,
                        }}
                        size="lg"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium text-gray-900 truncate">
                            {group.name}
                          </h3>
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <Users className="w-3 h-3" />
                            <span>{group.memberCount || 0}</span>
                          </div>
                        </div>

                        {group.lastMessage ? (
                          <p className="text-sm text-gray-600 truncate">
                            <span className="font-medium">
                              {group.lastMessage.authorName}:
                            </span>{" "}
                            {group.lastMessage.content}
                          </p>
                        ) : (
                          <p className="text-sm text-gray-500 italic">
                            No messages yet
                          </p>
                        )}
                      </div>
                    </div>

                    {group.lastMessage && (
                      <time className="text-xs text-gray-400 ml-3">
                        {formatTime(group.lastMessage.createdAt)}
                      </time>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Simple FAB */}
      <div className="fixed bottom-24 right-4 space-y-2">
        <Button
          onClick={() => setShowJoinModal(true)}
          className="rounded-full w-12 h-12 bg-gray-600 hover:bg-gray-700 shadow-lg"
        >
          <Users className="w-5 h-5" />
        </Button>
        <Button
          onClick={() => setShowCreateModal(true)}
          className="rounded-full w-14 h-14 bg-blue-600 hover:bg-blue-700 shadow-lg"
        >
          <Plus className="w-6 h-6" />
        </Button>
      </div>

      {/* Modals */}
      <CreateGroupModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onGroupCreated={handleGroupCreated}
      />

      <JoinGroupModal
        isOpen={showJoinModal}
        onClose={() => setShowJoinModal(false)}
        onGroupJoined={handleGroupJoined}
      />
    </div>
  );
}
