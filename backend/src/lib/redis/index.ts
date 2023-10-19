import Redis, { RedisOptions } from 'ioredis';
import { env } from 'src/env';

const options: RedisOptions = {
  host: env.REDIS_HOST,
  port: env.REDIS_PORT ? parseInt(env.REDIS_PORT) : undefined,
  username: env.REDIS_USERNAME,
  password: env.REDIS_PASSWORD,
};

export const redis = new Redis(options);
