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
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (data.type === 'click') return this.eventsService.click(data);
  }
}
