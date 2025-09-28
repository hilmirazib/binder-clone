import { MemberRole } from "@prisma/client";

export interface CreateGroupData {
  name: string;
  description?: string;
  avatarEmoji?: string;
  avatarColor?: string;
  isPublic?: boolean;
}

export interface UpdateGroupData {
  name?: string;
  description?: string;
  avatarEmoji?: string;
  avatarColor?: string;
  isPublic?: boolean;
}

export interface JoinGroupData {
  inviteCode: string;
}

export interface GroupMember {
  groupId: string;
  userId: string;
  role: MemberRole;
  joinedAt: Date;
  user: {
    userId: string;
    displayName: string | null;
    username: string | null;
    avatarEmoji: string | null;
    avatarColor: string | null;
  };
}

export interface Group {
  id: string;
  name: string;
  description: string | null;
  avatarEmoji: string | null;
  avatarColor: string | null;
  isPublic: boolean;
  inviteCode: string;
  ownerId: string;
  createdAt: Date;
  owner: {
    userId: string;
    displayName: string | null;
    username: string | null;
    avatarEmoji: string | null;
    avatarColor: string | null;
  };
  _count: {
    members: number;
    messages: number;
    notes: number;
  };
}

export interface GroupWithMembers extends Group {
  members: GroupMember[];
  messages?: {
    id: string;
    content: string;
    createdAt: Date;
    author: {
      displayName: string | null;
      username: string | null;
    };
  }[];
}

export interface GroupPreview {
  id: string;
  name: string;
  description: string | null;
  avatarEmoji: string | null;
  avatarColor: string | null;
  isPublic: boolean;
  owner: {
    displayName: string | null;
    username: string | null;
  };
  _count: {
    members: number;
  };
}
