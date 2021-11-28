import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway()
export class SocketGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer()
  server: Server;

  afterInit(server: Server) {
  }

  handleConnection(client: Socket, ...args: any[]) {
  }

  handleDisconnect(client: Socket) {
  }

  @SubscribeMessage('message')
  handleMessage(  
    @MessageBody() data: string,
    @ConnectedSocket() client: Socket
  ) {
  }
}
