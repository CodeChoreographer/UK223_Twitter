import { z } from 'zod';

export const registerSchema = z.object({
  username: z.string().min(3).max(32),
  password: z.string().min(6).max(128),
});

export const loginSchema = z.object({
  username: z.string().min(3).max(32),
  password: z.string().min(1),
});

export const updateUserSchema = z.object({
  userId: z.number(),
  username: z.string().min(3).max(32),
  password: z.string().min(6).max(128),
});

export const tweetCreateSchema = z.object({
  content: z.string().min(1).max(280),
});

export const tweetEditSchema = z.object({
  id: z.number(),
  content: z.string().min(1).max(280),
});

export const commentAddSchema = z.object({
  tweetId: z.number(),
  content: z.string().min(1).max(280),
});

export const commentEditSchema = z.object({
  id: z.number(),
  content: z.string().min(1).max(280),
});
