import { Module } from '@nestjs/common';
import { PrestigesService } from './prestiges.service';
import { PrestigesController } from './prestiges.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Prestige } from './prestige/prestige.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Prestige])],
  controllers: [PrestigesController],
  providers: [PrestigesService],
})
export class PrestigesModule {}
