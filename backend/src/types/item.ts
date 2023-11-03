import { z } from 'zod';

export const ItemSchema = z.object({
  id: z.string(),
  moneyPerSecond: z.string(),
  moneyPerClickMult: z.string(),
  image: z.string(),
  name: z.string(),
  price: z.string(),
});
export type IItem = z.infer<typeof ItemSchema>;

export const ItemBoughtSchema = z.object({
  id: z.string(),
  item: ItemSchema,
  timesBought: z.string(),
  // user: UserSchema,
  createdAt: z.date(),
});
export type IItemBought = z.infer<typeof ItemBoughtSchema>;
