import Redis, { Callback, RedisOptions, Result } from 'ioredis';
import { env } from 'src/env';

const options: RedisOptions = {
  host: env.REDIS_HOST,
  port: env.REDIS_PORT ? parseInt(env.REDIS_PORT) : undefined,
  username: env.REDIS_USERNAME,
  password: env.REDIS_PASSWORD,
  //? increx
  scripts: {
    increx: {
      lua: `
        local current = redis.call('get', KEYS[1])
        if current then
          redis.call('incr', KEYS[1])
          return current + 1
        else
          redis.call('setex', KEYS[1], ARGV[1], ARGV[2])
          return ARGV[2]
        end
      `,
      numberOfKeys: 1,
    },
  },
};

export const redis = new Redis(options);

// Add declarations
declare module 'ioredis' {
  interface RedisCommander<Context> {
    increx(
      key: string,
      ttl: number,
      defaultValue: number,
      callback?: Callback<string>,
    ): Result<string, Context>;
  }
}
