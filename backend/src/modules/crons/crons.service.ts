import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { env } from 'src/env';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import { ItemBought } from '../items/entities/item.entity';
import { PrestigeBought } from '../prestiges/entities/prestige.entity';
import { Cron } from '@nestjs/schedule';
import { redis } from 'src/lib/redis';
import { redisNamespace } from 'src/lib/storage';

@Injectable()
export class CronsService implements OnModuleInit {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(ItemBought)
    private readonly itemsBoughtRepository: Repository<ItemBought>,
    @InjectRepository(PrestigeBought)
    private readonly prestigesBoughtRepository: Repository<PrestigeBought>,
  ) {}

  private readonly logger = new Logger(CronsService.name);

  onModuleInit() {
    this.logger.debug('Crons module initialized');
    this.logger.debug(
      `Running syncDB every ${
        env.ENV !== 'development' ? '2 minutes' : '30 seconds'
      }`,
    );
  }

  /**
   * @description Sync database with redis
   */
  @Cron(env.ENV !== 'development' ? '0 */2 * * * *' : '*/5 * * * * *')
  async syncDB() {
    //? Check if lock exists
    const lock = await redis.get(`lock:${redisNamespace}`);
    if (lock) {
      this.logger.debug('Lock exists, skipping syncDB');
      return;
    }
    //? Lock the database
    await redis.setex(`lock:${redisNamespace}`, 10, 'true'); // 10 seconds max
    //? We store all the redis value under the prefix 'async' (async:users, async:posts, etc.) in database
    //? Then delete them
    const keys = await redis.keys(`${redisNamespace}:*`);
    if (!keys.length) {
      //? Delete lock
      await redis.del(`lock:${redisNamespace}`);
      return;
    }
    const data = await redis.mget(keys);
    const parsedData = (data.filter((d) => d) as string[]).map((d) =>
      JSON.parse(d),
    );
    // example of key: async:users:057-dza7-...
    let i = 0;
    for (const key of keys) {
      const namespace = key.split(':')[1];
      //? Get the data for the current key
      const data = parsedData[i];
      if (namespace === 'users') {
        if (data.itemsBought.length > 0) {
          //? Save itemsBought
          for (const itemBought of data.itemsBought) {
            await this.itemsBoughtRepository.save(itemBought);
          }
        }
        if (data.prestigesBought.length > 0) {
          //? Save prestigesBought
          for (const prestigeBought of data.prestigesBought) {
            await this.prestigesBoughtRepository.save(prestigeBought);
          }
        }
        //? Save user
        await this.usersRepository.save(data);
        // } else if (namespace === 'itemsBought') {
        //   totalItemsBought++;
        //   await this.itemsBoughtRepository.save(data);
        // } else if (namespace === 'prestigesBought') {
        //   await this.prestigesBoughtRepository.save(data);
      } else {
        this.logger.error(`Unknown namespace ${namespace}`);
      }
      i++;
    }
    //? Delete keys
    await redis.del(keys);
    //? Delete lock
    await redis.del(`lock:${redisNamespace}`);
  }
}
