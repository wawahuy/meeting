import { forwardRef, Module } from '@nestjs/common';
import { AuthModule } from 'src/modules/auth/auth.module';
import { UserModule } from 'src/modules/user/user.module';
import { SocketGateway } from './socket.gateway';
import { SocketRoomService } from './socket-room.service';
import { FriendModule } from 'src/modules/friend/friend.module';
import { SocketFriendService } from './socket-friend.service';
import { SocketMessageService } from './socket-message.service';
import { MessageModule } from 'src/modules/message/message.module';
import { RoomModule } from 'src/modules/room/room.module';

@Module({
  providers: [
    SocketGateway,
    SocketRoomService,
    SocketFriendService,
    SocketMessageService
  ],
  exports: [
    SocketGateway,
    SocketRoomService,
    SocketFriendService,
    SocketMessageService
  ],
  imports: [
    AuthModule,
    UserModule,
    FriendModule,
    forwardRef(() => MessageModule),
    forwardRef(() => RoomModule),
  ]
})
export class SocketModule {}
