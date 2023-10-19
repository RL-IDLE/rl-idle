import { Module } from '@nestjs/common';
import { CronsService } from './crons.service';
import { User } from '../users/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Item, ItemBought } from '../items/entities/item.entity';

@Module({
  providers: [CronsService],
  imports: [TypeOrmModule.forFeature([User, Item, ItemBought])],
})
export class CronsModule {}
