import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { EventsService } from './events.service';
import { IWsEvent } from 'src/types/api';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class EventsGateway {
  constructor(private readonly eventsService: EventsService) {}

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('events')
  findAll(@MessageBody() data: IWsEvent[keyof IWsEvent]['body']) {
    if (data.type === 'click') return this.eventsService.click(data);
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (data.type === 'buyItem')
      return this.eventsService.buyItem(data, this.server);
  }
}
