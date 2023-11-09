import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { EventsService } from './events.service';
import { IWsEvent } from 'src/types/api';
import { OnModuleInit } from '@nestjs/common';
import { logger } from 'src/lib/logger';
import { redis } from 'src/lib/redis';
import { randomUUID } from 'crypto';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class EventsGateway implements OnModuleInit {
  constructor(private readonly eventsService: EventsService) {}

  onModuleInit() {
    this.handleBonusPopup();
    logger.debug(`Running bonus popup every 2~5 minutes`);
  }

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('events')
  findAll(@MessageBody() data: IWsEvent[keyof IWsEvent]['body']) {
    if (data.type === 'click')
      return this.eventsService.click(data, this.server);
    if (data.type === 'buyItem')
      return this.eventsService.buyItem(data, this.server);
    if (data.type === 'buyPrestige')
      return this.eventsService.buyPrestige(data, this.server);
    if (data.type === 'addTokenBonusSchema')
      return this.eventsService.addTokenBonus(data, this.server);

    return this.eventsService.livelinessProbe(data);
  }

  /**
   * @description Random bonus popup every 2~5 minutes
   */
  handleBonusPopup() {
    const bonusPopup = async () => {
      const kindNumber = Math.floor(Math.random() * 4); // 0~3
      const kind = kindNumber < 1 ? 'emeralds' : 'money';
      const bonusId = randomUUID();
      //? Between 0.2 and 0.8
      const xPos = Math.random() * (0.8 - 0.2) + 0.2;
      if (kind === 'money') {
        logger.debug('New money bonus');
        //? Save in redis
        await redis.setex(`bonus:money:${bonusId}`, 40, bonusId);
        //? Send the ws
        this.server.emit(
          `bonus:money`,
          JSON.stringify({
            id: bonusId,
            xPos,
          }),
        );
      } else {
        logger.debug('New emeralds bonus');
      }
    };

    const randomTime = Math.floor(Math.random() * 180000) + 120000; // 2~5 minutes
    // const randomTime = Math.floor(Math.random() * 1800) + 1200;

    setTimeout(async () => {
      await bonusPopup();
      this.handleBonusPopup();
    }, randomTime);
  }
}
