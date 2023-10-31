import { z } from 'zod';

export const PrestigeSchema = z.object({
  id: z.string(),
  moneyMult: z.string(),
  image: z.string(),
  name: z.string(),
  price: z.string(),
});
export type IPrestige = z.infer<typeof PrestigeSchema>;

export const PrestigeBoughtSchema = z.object({
  id: z.string(),
  prestige: PrestigeSchema,
  // user: UserSchema,
  createdAt: z.date(),
});
export type IPrestigeBought = z.infer<typeof PrestigeBoughtSchema>;
