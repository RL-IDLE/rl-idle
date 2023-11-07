import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventsModule } from './modules/events/events.module';
import { UsersModule } from './modules/users/users.module';
import configurations from './config';
import { CronsModule } from './modules/crons/crons.module';
import { ItemsModule } from './modules/items/items.module';
import { PrestigesModule } from './modules/prestiges/prestiges.module';
import { PaymentsModule } from './modules/payments/payments.module';

@Module({
  imports: [
    ...configurations,
    EventsModule,
    CronsModule,
    UsersModule,
    ItemsModule,
    PrestigesModule,
    PaymentsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
