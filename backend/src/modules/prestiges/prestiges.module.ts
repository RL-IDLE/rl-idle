import { Module } from '@nestjs/common';
import { PrestigesService } from './prestiges.service';
import { PrestigesController } from './prestiges.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Prestige, PrestigeBought } from './entities/prestige.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Prestige, PrestigeBought])],
  controllers: [PrestigesController],
  providers: [PrestigesService],
})
export class PrestigesModule {}
