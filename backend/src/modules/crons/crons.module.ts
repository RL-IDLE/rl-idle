import { Module } from '@nestjs/common';
import { CronsService } from './crons.service';
import { User } from '../users/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  providers: [CronsService],
  imports: [TypeOrmModule.forFeature([User])],
})
export class CronsModule {}
