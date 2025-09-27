import { z } from "zod";

export const usernameSchema = z
  .string()
  .min(3)
  .max(24)
  .regex(/^[a-z0-9_]+$/, "only lowercase, numbers, underscore");

export const phoneSchema = z.object({
  countryCode: z.string().min(2, "Please select country code"),
  phoneNumber: z
    .string()
    .min(8, "Phone number must be at least 8 digits")
    .max(15, "Phone number too long"),
});

export const otpSchema = z.object({
  code: z
    .string()
    .length(6, "OTP must be exactly 6 digits")
    .regex(/^\d{6}$/, "OTP must contain only numbers"),
});

export const profileSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name too long"),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username too long")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers, and underscores",
    ),
  email: z.string().email("Please enter a valid email address"),
});
