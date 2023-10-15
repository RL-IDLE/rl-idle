import { z } from 'zod';

export const clickSchema = z.object({
  userId: z.string(),
});
