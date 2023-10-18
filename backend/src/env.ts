import { createEnv } from '@t3-oss/env-core';
import { z } from 'zod';

import { config } from 'dotenv';
config();

export const env = createEnv({
  server: {
    ENV: z.enum(['development', 'production']),
    DATABASE_HOST: z.string(),
    DATABASE_PORT: z.string(),
    DATABASE_USER: z.string(),
    DATABASE_PASS: z.string(),
    DATABASE_KIND: z.string(),
    REDIS_HOST: z.string(),
    REDIS_USERNAME: z.string(),
    REDIS_PASSWORD: z.string(),
    REDIS_PORT: z.string(),
    REDIS_URL: z.string(),
    REDIS_USE_TLS: z.coerce.boolean(),
    BASE_URL: z.string(),
  },
  clientPrefix: 'PUBLIC_',
  client: {},
  runtimeEnv: process.env,
});
