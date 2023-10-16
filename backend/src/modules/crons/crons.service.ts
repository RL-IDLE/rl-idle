import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { env } from 'src/env';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import { redisNamespace } from 'src/lib/storage';
import { redis } from 'src/lib/redis';

@Injectable()
export class CronsService implements OnModuleInit {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  private readonly logger = new Logger(CronsService.name);

  onModuleInit() {
    this.logger.debug('Crons module initialized');
    this.logger.debug(
      `Running syncDB every ${
        env.ENV !== 'development' ? '10 minutes' : 'minute'
      }`,
    );
  }

  /**
   * @description Sync database with redis
   */
  @Cron(env.ENV !== 'development' ? '0 */10 * * * *' : '0 * * * * *')
  async syncDB() {
    //? We store all the redis value under the prefix 'async' (async:users, async:posts, etc.) in database
    //? Then delete them
    const keys = await redis.keys(`${redisNamespace}:*`);
    if (!keys.length) return;
    const data = await redis.mget(keys);
    const parsedData = (data.filter((d) => d) as string[]).map((d) =>
      JSON.parse(d),
    );
    // example of key: async:users:057-dza7-...
    for (const key of keys) {
      const namespace = key.split(':')[1];
      if (namespace === 'users') {
        await this.usersRepository.save(parsedData);
        await redis.del(key);
      } else {
        this.logger.error(`Unknown namespace ${namespace}`);
      }
    }
  }
}
