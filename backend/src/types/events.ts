import { z } from 'zod';

export const clickSchema = z.object({
  type: z.literal('click'),
  userId: z.string(),
});

export const buyItemSchema = z.object({
  type: z.literal('buyItem'),
  userId: z.string(),
  itemId: z.string(),
});
