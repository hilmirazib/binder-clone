import { supabase } from "@/lib/supabase";

export class GroupService {
  static async createGroup(data: {
    name: string;
    description?: string;
    avatarEmoji?: string;
    avatarColor?: string;
    isPublic?: boolean;
  }) {
    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        console.error("Auth error:", authError);
        throw new Error("User not authenticated");
      }

      console.log("Creating group with user:", user.id);

      const inviteCode = this.generateInviteCode();

      const groupData = {
        name: data.name,
        ownerId: user.id,
        inviteCode: inviteCode,
        description: data.description || null,
        avatarEmoji: data.avatarEmoji || "👥",
        avatarColor: data.avatarColor || "#6366F1",
        isPublic: data.isPublic || false,
      };

      console.log("Group data to insert:", groupData);

      // Create group
      const { data: group, error: groupError } = await supabase
        .from("Group")
        .insert(groupData)
        .select()
        .single();

      if (groupError) {
        console.error("Group creation error:", groupError);
        throw groupError;
      }

      console.log("Group created successfully:", group);

      // Add owner as member
      const { error: memberError } = await supabase.from("GroupMember").insert({
        groupId: group.id,
        userId: user.id,
        role: "owner",
      });

      if (memberError) {
        console.error("Member creation error:", memberError);
        throw memberError;
      }

      return group;
    } catch (error) {
      console.error("Failed to create group:", error);
      throw error;
    }
  }

  static generateInviteCode(): string {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  static async getUserGroups() {
    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        throw new Error("User not authenticated");
      }

      const { data: groups, error } = await supabase
        .from("GroupMember")
        .select(
          `
          Group (
            id,
            name,
            description,
            avatarEmoji,
            avatarColor,
            inviteCode,
            ownerId,
            createdAt
          )
        `,
        )
        .eq("userId", user.id);

      if (error) throw error;

      // Transform the data
      const transformedGroups =
        groups
          ?.map((item) =>
            Array.isArray(item.Group) ? item.Group[0] : item.Group,
          )
          .filter(Boolean) || [];

      return transformedGroups;
    } catch (error) {
      console.error("Failed to get groups:", error);
      throw error;
    }
  }

  static async getGroupById(groupId: string) {
    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        throw new Error("User not authenticated");
      }

      // Check if user is member of this group
      const { data: membership, error: membershipError } = await supabase
        .from("GroupMember")
        .select("role")
        .eq("groupId", groupId)
        .eq("userId", user.id)
        .single();

      if (membershipError || !membership) {
        throw new Error("You are not a member of this group");
      }

      // Get group details
      const { data: group, error: groupError } = await supabase
        .from("Group")
        .select(
          `
        id,
        name,
        description,
        avatarEmoji,
        avatarColor,
        inviteCode,
        ownerId,
        isPublic,
        createdAt,
        owner:Profile!Group_ownerId_fkey(
          userId,
          displayName,
          username,
          avatarEmoji,
          avatarColor
        )
      `,
        )
        .eq("id", groupId)
        .single();

      if (groupError) throw groupError;

      // Get all members
      const { data: members, error: membersError } = await supabase
        .from("GroupMember")
        .select(
          `
        groupId,   
        userId,
        role,
        joinedAt,
        user:Profile!GroupMember_userId_fkey(
          userId,
          displayName,
          username,
          avatarEmoji,
          avatarColor
        )
      `,
        )
        .eq("groupId", groupId)
        .order("role", { ascending: true })
        .order("joinedAt", { ascending: true });

      if (membersError) throw membersError;

      // Get counts safely
      const { count: membersCount } = await supabase
        .from("GroupMember")
        .select("*", { count: "exact", head: true })
        .eq("groupId", groupId);

      const { count: messagesCount } = await supabase
        .from("Message")
        .select("*", { count: "exact", head: true })
        .eq("groupId", groupId);

      // Try to get notes count, but handle error gracefully
      // Count only published notes + own drafts (same as getGroupNotes)
      let notesCount = 0;
      try {
        const { count } = await supabase
          .from("Note")
          .select("*", { count: "exact", head: true })
          .eq("groupId", groupId)
          .or(`status.eq.published,authorId.eq.${user.id}`);
        notesCount = count || 0;
      } catch (noteError) {
        console.warn("Could not fetch notes count:", noteError);
        // Continue without notes count
      }

      // Ensure user and owner are objects, not arrays (Supabase sometimes returns arrays for relations)
      const processedMembers = (members || []).map((member) => ({
        ...member,
        user: Array.isArray(member.user) ? member.user[0] : member.user,
      }));

      const processedGroup = {
        ...group,
        owner: Array.isArray(group.owner) ? group.owner[0] : group.owner,
      };

      return {
        ...processedGroup,
        members: processedMembers,
        _count: {
          members: membersCount || 0,
          messages: messagesCount || 0,
          notes: notesCount,
        },
      };
    } catch (error) {
      console.error("Failed to get group:", error);
      throw error;
    }
  }

  // MISSING METHOD 2: Leave group
  static async leaveGroup(groupId: string) {
    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        throw new Error("User not authenticated");
      }

      // Check if user is owner
      const { data: group } = await supabase
        .from("Group")
        .select("ownerId, name")
        .eq("id", groupId)
        .single();

      if (!group) {
        throw new Error("Group not found");
      }

      if (group.ownerId === user.id) {
        // Owner is leaving - check if there are other members
        const { data: otherMembers } = await supabase
          .from("GroupMember")
          .select("userId, role")
          .eq("groupId", groupId)
          .neq("userId", user.id);

        if (otherMembers && otherMembers.length > 0) {
          // Transfer ownership to first admin or member
          const newOwnerId = otherMembers[0].userId;

          // Update group owner
          await supabase
            .from("Group")
            .update({ ownerId: newOwnerId })
            .eq("id", groupId);

          // Update new owner's role
          await supabase
            .from("GroupMember")
            .update({ role: "owner" })
            .eq("groupId", groupId)
            .eq("userId", newOwnerId);
        } else {
          // Owner is only member, delete group
          await supabase.from("Group").delete().eq("id", groupId);
          return true;
        }
      }

      // Remove user from group
      const { error } = await supabase
        .from("GroupMember")
        .delete()
        .eq("groupId", groupId)
        .eq("userId", user.id);

      if (error) throw error;

      return true;
    } catch (error) {
      console.error("Failed to leave group:", error);
      throw error;
    }
  }

  static async joinGroupByInvite(inviteCode: string) {
    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        throw new Error("User not authenticated");
      }

      // Find group by invite code
      const { data: group, error: groupError } = await supabase
        .from("Group")
        .select("id, name, ownerId")
        .eq("inviteCode", inviteCode.toUpperCase())
        .single();

      if (groupError || !group) {
        throw new Error("Invalid invite code");
      }

      // Check if already a member
      const { data: existingMember } = await supabase
        .from("GroupMember")
        .select("groupId")
        .eq("groupId", group.id)
        .eq("userId", user.id)
        .single();

      if (existingMember) {
        throw new Error("You are already a member of this group");
      }

      // Add as member
      const { error: memberError } = await supabase.from("GroupMember").insert({
        groupId: group.id,
        userId: user.id,
        role: "member",
      });

      if (memberError) throw memberError;

      return group;
    } catch (error) {
      console.error("Failed to join group:", error);
      throw error;
    }
  }

  // MISSING METHOD 4: Get invite info for preview
  static async getInviteInfo(inviteCode: string) {
    try {
      const { data: group, error } = await supabase
        .from("Group")
        .select(
          `
          id,
          name,
          description,
          avatarEmoji,
          avatarColor,
          isPublic,
          owner:Profile!Group_ownerId_fkey(
            displayName,
            username
          )
        `,
        )
        .eq("inviteCode", inviteCode.toUpperCase())
        .single();

      if (error) throw error;

      // Get member count
      const { count: memberCount } = await supabase
        .from("GroupMember")
        .select("*", { count: "exact", head: true })
        .eq("groupId", group.id);

      // Ensure owner is an object, not array
      const processedGroup = {
        ...group,
        owner: Array.isArray(group.owner) ? group.owner[0] : group.owner,
      };

      return {
        ...processedGroup,
        _count: {
          members: memberCount || 0,
        },
      };
    } catch (error) {
      console.error("Failed to get invite info:", error);
      throw new Error("Invalid invite code");
    }
  }
}
