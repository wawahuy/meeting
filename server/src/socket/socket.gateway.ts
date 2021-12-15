import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer, WsException } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthService } from 'src/modules/auth/auth.service';
import { UserService } from 'src/modules/user/user.service';

@WebSocketGateway({ cors: { origin: ['http://localhost:4200', 'https://localhost:4200', 'https://metmes.pw'] }})
export class SocketGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer()
  server: Server;

  constructor(
    private authService: AuthService,
    private userService: UserService
  ) {
  }

  afterInit(server: Server) {
  }

  async handleConnection(client: Socket, ...args: any[]) {
    try {
      const token = client.handshake.headers.authorization;
      const decodeToken = this.authService.verifyJwt(token);
      const user = await this.userService.getByUsername(decodeToken.user);
      if (!user) {
        throw new WsException('Error ws');
      }

      client.data.user = user;
      await this.userService.pushSocketId(user._id, client.id);
    } catch (e) {
      await this.disconnect(client);
    }
  }

  async handleDisconnect(client: Socket) {
    await this.disconnect(client);
  }

  @SubscribeMessage('ping')
  handleMessage(  
    @MessageBody() data: string,
    @ConnectedSocket() client: Socket
  ) {
    client.emit('pong');
  }

  async disconnect(socket: Socket) {
    const user = socket.data?.user;
    
    if (user) {
      await this.userService.pullSocketId(user._id, socket.id);
    }
    socket.disconnect();
  }
}
