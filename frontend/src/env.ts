import { createEnv } from '@t3-oss/env-core';
import { z } from 'zod';

export const env = createEnv({
  server: {},
  clientPrefix: 'VITE_',
  client: {
    VITE_ENV: z.enum(['development', 'production', 'stagging']),
    VITE_API_URL: z.string().url(),
    VITE_STRIPE_PUBLIC_KEY: z.string(),
  },
  runtimeEnv: import.meta.env,
});
