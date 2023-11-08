import { Module } from '@nestjs/common';
import { CronsService } from './crons.service';
import { Subscription, User } from '../users/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Item, ItemBought } from '../items/entities/item.entity';
import { PrestigeBought } from '../prestiges/entities/prestige.entity';

@Module({
  providers: [CronsService],
  imports: [
    TypeOrmModule.forFeature([
      User,
      Item,
      ItemBought,
      PrestigeBought,
      Subscription,
    ]),
  ],
})
export class CronsModule {}
