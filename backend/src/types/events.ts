import { z } from 'zod';

export const clickSchema = z.object({
  type: z.literal('click'),
  userId: z.string(),
});
