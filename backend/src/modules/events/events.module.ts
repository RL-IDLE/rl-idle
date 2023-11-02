import { Module } from '@nestjs/common';
import { EventsGateway } from './events.gateway';
import { EventsService } from './events.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Item, ItemBought } from '../items/entities/item.entity';
import {
  Prestige,
  PrestigeBought,
} from '../prestiges/entities/prestige.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Item,
      ItemBought,
      Prestige,
      PrestigeBought,
    ]),
  ],
  providers: [EventsGateway, EventsService],
})
export class EventsModule {}
