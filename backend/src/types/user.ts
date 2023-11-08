import { string, z } from 'zod';
import { ItemBoughtSchema } from './item';
import { PrestigeBoughtSchema } from './prestige';

export const UserSchema = z.object({
  id: z.string(),
  username: z.string(),
  moneyFromClick: z.string(),
  moneyPerClick: z.string(),
  moneyUsed: z.string(),
  itemsBought: z.array(ItemBoughtSchema),
  prestigesBought: z.array(PrestigeBoughtSchema),
  lastSeen: z.date(),
  emeralds: z.string(),
});

export type IUser = z.infer<typeof UserSchema>;

export const FindUserSchema = z.object({
  id: z.string(),
});
export type IFindUser = z.infer<typeof FindUserSchema>;

export const CreateUserSchema = z.object({});
export type ICreateUser = z.infer<typeof CreateUserSchema>;

export type ILoadUser = IFindUser | ICreateUser;

export const ResetSchema = z.object({
  id: z.string(),
});

export type IReset = z.infer<typeof ResetSchema>;

export const GiveSchema = z.object({
  id: z.string(),
  amount: z.string(),
});

export type IGive = z.infer<typeof GiveSchema>;

export const RemoveSchema = z.object({
  id: z.string(),
  amount: z.string(),
});

export type IRemove = z.infer<typeof RemoveSchema>;

export const GivePrestigeSchema = z.object({
  id: z.string(),
});

export type IGivePrestige = z.infer<typeof GivePrestigeSchema>;

export const RemovePrestigeSchema = z.object({
  id: string(),
});

export type IRemovePrestige = z.infer<typeof RemovePrestigeSchema>;

export const GiveItemSchema = z.object({
  id: z.string(),
  itemId: z.string(),
});

export type IGiveItem = z.infer<typeof GiveItemSchema>;

export const RemoveItemSchema = z.object({
  id: z.string(),
  itemId: z.string(),
});

export type IRemoveItem = z.infer<typeof RemoveItemSchema>;

export const ConfirmPaymentSchema = z.object({
  id: z.string(),
  checkoutSessionId: z.string(),
});

export type IConfirmPayment = z.infer<typeof ConfirmPaymentSchema>;
