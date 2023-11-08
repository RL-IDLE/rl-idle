import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { env } from 'src/env';
import { Subscription, User } from '../users/entities/user.entity';
import { LessThan, Repository } from 'typeorm';
import { ItemBought } from '../items/entities/item.entity';
import { PrestigeBought } from '../prestiges/entities/prestige.entity';
import { Cron } from '@nestjs/schedule';
import { redis } from 'src/lib/redis';
import { redisNamespace } from 'src/lib/storage';
import webPush, { PushSubscription } from 'web-push';
import { maxPassiveIncomeInterval } from 'src/lib/constant';

@Injectable()
export class CronsService implements OnModuleInit {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(ItemBought)
    private readonly itemsBoughtRepository: Repository<ItemBought>,
    @InjectRepository(PrestigeBought)
    private readonly prestigesBoughtRepository: Repository<PrestigeBought>,
    @InjectRepository(Subscription)
    private readonly subscriptionsRepository: Repository<Subscription>,
  ) {}

  private readonly logger = new Logger(CronsService.name);

  onModuleInit() {
    this.logger.debug('Crons module initialized');
    this.logger.debug(
      `Running syncDB every ${
        env.ENV !== 'development' ? '2 minutes' : '30 seconds'
      }`,
    );
    this.logger.debug(
      `Running notifications every ${
        env.ENV !== 'development' ? '1 minute' : '30 seconds'
      }`,
    );
  }

  /**
   * @description Sync database with redis
   */
  @Cron(env.ENV !== 'development' ? '0 */2 * * * *' : '*/30 * * * * *')
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

  /**
   * @description Notifications cron
   */
  @Cron(env.ENV !== 'development' ? '0 * * * * *' : '*/30 * * * * *')
  async passiveIncomeNotification() {
    const users = await this.usersRepository.find({
      where: {
        lastSeen: LessThan(new Date(Date.now() - maxPassiveIncomeInterval)),
        passiveNotificationSent: false,
      },
      relations: ['subscriptions'],
    });
    await Promise.all(
      users.map(async (user) => {
        const subs = user.subscriptions;
        //? Update user
        await this.usersRepository.update(
          { id: user.id },
          { passiveNotificationSent: true },
        );
        if (!subs.length) {
          return;
        }
        //? Send notification
        await Promise.all(
          subs.map(async (sub) => {
            const payload = JSON.stringify({
              title: 'Claim your rewards!',
              body: 'You have reached the maximum passive income. Come back to get more!',
              icon: env.BASE_URL + '/public/logo.webp',
            });
            try {
              await webPush.sendNotification(
                sub.subscription as PushSubscription,
                payload,
              );
              this.logger.debug('Notification sent to: ' + user.id);
            } catch (err) {
              if (err.statusCode === 410) {
                //? Delete subscription
                await this.subscriptionsRepository.delete({ id: sub.id });
              } else {
                throw err;
              }
            }
          }),
        );
      }),
    );
  }
}
