import { z } from 'zod';
import { ItemBoughtSchema } from './item';

export const UserSchema = z.object({
  id: z.string(),
  moneyFromClick: z.string(),
  moneyPerClick: z.string(),
  moneyUsed: z.string(),
  itemsBought: z.array(ItemBoughtSchema),
});

export type IUser = z.infer<typeof UserSchema>;

export const FindUserSchema = z.object({
  id: z.string(),
});
export type IFindUser = z.infer<typeof FindUserSchema>;

export const CreateUserSchema = z.object({});
export type ICreateUser = z.infer<typeof CreateUserSchema>;

export type ILoadUser = IFindUser | ICreateUser;
