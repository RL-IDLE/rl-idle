import { createEnv } from '@t3-oss/env-core';
import { z } from 'zod';

export const env = createEnv({
  server: {},
  clientPrefix: 'VITE_',
  client: {
    VITE_ENV: z.enum(['development', 'production']),
    VITE_API_URL: z.string().url(),
  },
  runtimeEnv: import.meta.env,
});
