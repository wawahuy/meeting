import { forwardRef, Inject } from '@nestjs/common';
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer, WsException, WsResponse } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { SocketMessageNewRecv, SocketMessageReceiverStatusRecv, SocketMessageTypingRecv, SocketRecvName } from 'src/models/socket';
import { AuthService } from 'src/modules/auth/auth.service';
import { UserService } from 'src/modules/user/user.service';
import { SocketFriendService } from './socket-friend.service';
import { SocketMessageService } from './socket-message.service';

@WebSocketGateway({ cors: { origin: ['http://localhost:4200', 'https://dev.metmes.pw', 'https://metmes.pw'] }})
export class SocketGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer()
  server: Server;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    @Inject(forwardRef(() => SocketFriendService)) private socketFriendService: SocketFriendService,
    @Inject(forwardRef(() => SocketMessageService)) private socketMessageService: SocketMessageService,
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

      user.friends = undefined;
      user.password = undefined;
      client.data.user = user;
      
      await this.userService.pushSocketId(user._id, client.id);
      await this.socketFriendService.emitStatusAllFriend(user._id, client.id, true);
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
      await this.socketFriendService.emitStatusAllFriend(user._id, socket.id, false);
    }
    socket.disconnect();
  }

  @SubscribeMessage(SocketRecvName.MessageNew)
  handleMessageNewEvent(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: SocketMessageNewRecv
  ) {
    this.socketMessageService.onMessageNew(client, data);
  }

  @SubscribeMessage(SocketRecvName.MessageReceiverStatus)
  handleMessageReceiverStatusEvent(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: SocketMessageReceiverStatusRecv
  ) {
    this.socketMessageService.onMessageReceiverStatus(client, data);
  }

  @SubscribeMessage(SocketRecvName.MessageTyping)
  handleMessageTypingEvent(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: SocketMessageTypingRecv
  ) {
    this.socketMessageService.onMessageTyping(client, data);
  }
}
