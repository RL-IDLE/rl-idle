import { z } from 'zod';

export const clickSchema = z.object({
  type: z.literal('click'),
  userId: z.string(),
  times: z.string(),
});

export const buyItemSchema = z.object({
  type: z.literal('buyItem'),
  userId: z.string(),
  itemId: z.string(),
  createdAt: z.string(),
});

export const buyPrestigeSchema = z.object({
  type: z.literal('buyPrestige'),
  userId: z.string(),
  prestigeId: z.string(),
});

export const livelinessProbeSchema = z.object({
  userId: z.string(),
  type: z.literal('livelinessProbe'),
});

export const addTokenBonusSchema = z.object({
  userId: z.string(),
  id: z.string(),
  type: z.literal('addTokenBonus'),
});

export const addEmeraldBonusSchema = z.object({
  userId: z.string(),
  id: z.string(),
  type: z.literal('addEmeraldBonus'),
});
