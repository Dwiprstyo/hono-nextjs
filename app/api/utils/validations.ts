import { z } from 'zod';

// Comment Validation Schema
export const CommentSchema = z.object({
  content: z.string().min(1, { message: "Comment content is required" }).max(300, { message: "Comment must be 300 characters or less" }),
  userId: z.number().int().positive(),
  postId: z.number().int().positive()
});

export const UpdateCommentSchema = CommentSchema.partial().extend({
  id: z.number().int().positive()
});
