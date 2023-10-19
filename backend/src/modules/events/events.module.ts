import { Module } from '@nestjs/common';
import { EventsGateway } from './events.gateway';
import { EventsService } from './events.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Item, ItemBought } from '../items/entities/item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Item, ItemBought])],
  providers: [EventsGateway, EventsService],
})
export class EventsModule {}
