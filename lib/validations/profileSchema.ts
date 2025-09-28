import { z } from "zod";

export const profileUpdateSchema = z.object({
  displayName: z
    .string()
    .min(2, "Display name must be at least 2 characters")
    .max(50, "Display name must be less than 50 characters")
    .regex(/^[a-zA-Z0-9\s._-]+$/, "Display name contains invalid characters"),

  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be less than 20 characters")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers, and underscores",
    )
    .refine(
      (username) => !username.startsWith("_") && !username.endsWith("_"),
      "Username cannot start or end with underscore",
    ),

  email: z
    .string()
    .email("Please enter a valid email address")
    .max(100, "Email must be less than 100 characters"),

  bio: z.string().max(160, "Bio must be less than 160 characters").optional(),

  avatarEmoji: z.string().optional(),
  avatarColor: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, "Invalid color format")
    .optional(),
});

export type ProfileUpdateForm = z.infer<typeof profileUpdateSchema>;
