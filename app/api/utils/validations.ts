import { z } from 'zod';

export const RegisterUserSchema = z.object({
  username: z.string().min(3, { message: "Username must be at least 3 characters" })
    .max(20, { message: "Username must be 20 characters or less" })
    .regex(/^[a-zA-Z0-9_]+$/, { message: "Username can only contain letters, numbers, and underscores" }),
  email: z.string().email(),
  password: z.string().min(6).max(100)
});

export const LoginUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(100)
});

export const PostSchema = z.object({
  content: z.string().min(1, { message: "Content is required" }).max(500, { message: "Content must be 500 characters or less" }),
  image: z.string().url().optional()
});

export const CreatePostSchema = PostSchema.extend({
  userId: z.number().int().positive()
});

export const UpdatePostSchema = PostSchema.partial().extend({
  id: z.number().int().positive()
});

// Like Validation Schema
export const LikeSchema = z.object({
  userId: z.number().int().positive(),
  postId: z.number().int().positive()
});

// Comment Validation Schema
export const CommentSchema = z.object({
  content: z.string().min(1, { message: "Comment content is required" }).max(300, { message: "Comment must be 300 characters or less" }),
  userId: z.number().int().positive(),
  postId: z.number().int().positive()
});

export const UpdateCommentSchema = CommentSchema.partial().extend({
  id: z.number().int().positive()
});

// Follow Validation Schema
export const FollowSchema = z.object({
  followerId: z.number().int().positive(),
  followingId: z.number().int().positive()
}).refine(data => data.followerId !== data.followingId, {
  message: "You cannot follow yourself"
});

export const ProfileUpdateSchema = z.object({
  username: z.string().min(3, { message: "Username must be at least 3 characters" })
    .max(20, { message: "Username must be 20 characters or less" })
    .regex(/^[a-zA-Z0-9_]+$/, { message: "Username can only contain letters, numbers, and underscores" })
    .optional(),
  
  email: z.string().email({ message: "Invalid email address" }).optional(),
  
  bio: z.string()
    .max(300, { message: "Bio must be 300 characters or less" })
    .optional(),
  
  avatar: z.string().url({ message: "Invalid avatar URL" }).optional(),

  // Optional password update with confirmation
  currentPassword: z.string().optional(),
  newPassword: z.string()
    .min(8, { message: "New password must be at least 8 characters" })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
      message: "Password must include uppercase, lowercase, number, and special character"
    })
    .optional(),
  confirmNewPassword: z.string().optional()
}).refine(
  (data) => {
    if (data.newPassword && data.newPassword !== data.confirmNewPassword) {
      throw new Error("New passwords do not match");
    }
    return true;
  },
  { path: ["confirmNewPassword"] }
);