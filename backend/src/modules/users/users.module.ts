import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import {
  Prestige,
  PrestigeBought,
} from '../prestiges/entities/prestige.entity';
import { Item, ItemBought } from '../items/entities/item.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Prestige,
      PrestigeBought,
      Item,
      ItemBought,
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
