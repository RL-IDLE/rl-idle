import { ObjectLiteral, Repository } from 'typeorm';
import { redis } from '../redis';

export const redisNamespace = 'async';

/**
 * @description Execute an action into redis, if there's a lock in redis, wait for it to be deleted
 * @param action Action to execute
 * @returns Data from redis or database
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function waitForLock<T extends () => Promise<any>>(
  action: T,
): Promise<ReturnType<T>> {
  const res = await new Promise<ReturnType<T>>(async (gresolve) => {
    const lock = await redis.get(`lock:${redisNamespace}`);
    if (lock) {
      gresolve(
        //? Wait for lock to be deleted
        (async () => {
          let interval: NodeJS.Timeout | null = null;
          const res = await new Promise<ReturnType<T>>((resolve) => {
            interval = setInterval(async () => {
              const lock = await redis.get(`lock:${redisNamespace}`);
              if (!lock) {
                resolve(action());
              } else {
              }
            }, 100);
          });
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
          if (interval) clearInterval(interval);
          return res;
        })(),
      );
    } else {
      gresolve(action());
    }
  });
  return res;
}

/**
 * @description Get data from redis, if not found, get from database and save in redis
 * @param databaseRepository Database repository
 * @param key Key of the data (used as prefix in redis)
 * @param id Id of the data
 * @param options Options
 * @returns Data from redis or database
 * @example
 * const user = await getOneData(UserRepository, '0');
 * console.log(user);
 * // User { id: '0', ... }
 */
export const getOneData = async <DBClass extends ObjectLiteral>({
  databaseRepository,
  key,
  id,
  options = { redisOnly: false, noSync: false },
}: {
  databaseRepository: Repository<DBClass>;
  key: string;
  id: string;
  options?: {
    redisOnly?: boolean;
    noSync?: boolean;
  };
}): Promise<DBClass | null> => {
  const data = await waitForLock(() =>
    redis.get(`${redisNamespace}:${key}:${id}`),
  );
  if (data) return JSON.parse(data);
  if (options.redisOnly) return null;
  const newData = (await databaseRepository.findOne({
    where: { id } as unknown as DBClass,
  })) as DBClass | null;
  if (!newData) return null;
  if (!options.noSync) {
    await waitForLock(() =>
      redis.set(`${redisNamespace}:${key}:${id}`, JSON.stringify(newData)),
    );
  } else {
    await waitForLock(() =>
      redis.set(
        `${key}:${id}`,
        JSON.stringify(newData),
        'EX',
        60 * 60, // 1 hour
      ),
    );
  }
  return newData;
};

/**
 * @description Save data in redis only (cron will save in database)
 * @param key Key of the data (used as prefix in redis)
 * @param id Id of the data (used as key in redis)
 * @param data New data to save
 */
export const saveOneData = async <DBClass extends ObjectLiteral>({
  key,
  id,
  data,
}: {
  key: string;
  id: string;
  data: DBClass;
}): Promise<void> => {
  await waitForLock(() =>
    redis.set(`${redisNamespace}:${key}:${id}`, JSON.stringify(data)),
  );
};
