import { createEnv } from '@t3-oss/env-core';
import { z } from 'zod';

import { config } from 'dotenv';
config();

export const env = createEnv({
  server: {
    ENV: z.enum(['development', 'production']),
    DATABASE_URL: z.string(),
    REDIS_HOST: z.string(),
    REDIS_USERNAME: z.string(),
    REDIS_PASSWORD: z.string(),
    REDIS_PORT: z.string(),
    REDIS_URL: z.string(),
    REDIS_USE_TLS: z.boolean(),
  },

  /**
   * The prefix that client-side variables must have. This is enforced both at
   * a type-level and at runtime.
   */
  clientPrefix: 'PUBLIC_',

  client: {},

  /**
   * What object holds the environment variables at runtime. This is usually
   * `process.env` or `import.meta.env`.
   */
  runtimeEnv: process.env,

  /**
   * By default, this library will feed the environment variables directly to
   * the Zod validator.
   *
   * This means that if you have an empty string for a value that is supposed
   * to be a number (e.g. `PORT=` in a ".env" file), Zod will incorrectly flag
   * it as a type mismatch violation. Additionally, if you have an empty string
   * for a value that is supposed to be a string with a default value (e.g.
   * `DOMAIN=` in an ".env" file), the default value will never be applied.
   *
   * In order to solve these issues, we recommend that all new projects
   * explicitly specify this option as true.
   */
  emptyStringAsUndefined: true,
});
