import { ObjectLiteral, Repository } from 'typeorm';
import { redis } from '../redis';

export const redisNamespace = 'async';

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
  options = { redisOnly: false },
}: {
  databaseRepository: Repository<DBClass>;
  key: string;
  id: string;
  options?: { redisOnly?: boolean };
}): Promise<DBClass | null> => {
  const data = await redis.get(`${redisNamespace}:${key}:${id}`);
  if (data) return JSON.parse(data);
  if (options.redisOnly) return null;
  const newData = (await databaseRepository.findOne({
    where: { id } as unknown as DBClass,
  })) as DBClass | null;
  if (!newData) return null;
  await redis.set(`${redisNamespace}:${key}:${id}`, JSON.stringify(newData));
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
  await redis.set(`${redisNamespace}:${key}:${id}`, JSON.stringify(data));
};
