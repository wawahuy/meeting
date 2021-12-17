import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer, WsException } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthService } from 'src/modules/auth/auth.service';
import { UserService } from 'src/modules/user/user.service';
import { SocketFriendService } from './socket-friend.service';

@WebSocketGateway({ cors: { origin: ['http://localhost:4200', 'https://dev.metmes.pw', 'https://metmes.pw'] }})
export class SocketGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer()
  server: Server;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private socketFriendService: SocketFriendService
  ) {
    socketFriendService.inject(this);
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

      if (user.sockets?.length == 0) {
        await this.socketFriendService.emitStatusAllFriend(user._id, true);
      }
    } catch (e) {
      await this.disconnect(client);
    }
  }

  async handleDisconnect(client: Socket) {
    await this.disconnect(client);
  }


  async disconnect(socket: Socket) {
    const user = socket.data?.user;
    
    if (user) {
      await this.userService.pullSocketId(user._id, socket.id);
      if (user.sockets?.length == 0) {
        await this.socketFriendService.emitStatusAllFriend(user._id, false);
      }
    }
    socket.disconnect();
  }
}
