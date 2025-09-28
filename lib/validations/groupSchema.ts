import { z } from "zod";

export const createGroupSchema = z.object({
  name: z
    .string()
    .min(2, "Group name must be at least 2 characters")
    .max(50, "Group name must be less than 50 characters")
    .regex(/^[a-zA-Z0-9\s._-]+$/, "Group name contains invalid characters"),

  description: z
    .string()
    .max(200, "Description must be less than 200 characters")
    .optional(),

  avatarEmoji: z.string().optional(),
  avatarColor: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, "Invalid color format")
    .optional(),
  isPublic: z.boolean().optional().default(false),
});

export const joinGroupSchema = z.object({
  inviteCode: z
    .string()
    .length(8, "Invite code must be exactly 8 characters")
    .regex(/^[A-Z0-9]+$/, "Invalid invite code format"),
});

export const updateGroupSchema = createGroupSchema.partial();

export type CreateGroupForm = z.infer<typeof createGroupSchema>;
export type JoinGroupForm = z.infer<typeof joinGroupSchema>;
export type UpdateGroupForm = z.infer<typeof updateGroupSchema>;
