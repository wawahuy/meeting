import { Module } from '@nestjs/common';
import { AuthModule } from 'src/modules/auth/auth.module';
import { UserModule } from 'src/modules/user/user.module';
import { SocketGateway } from './socket.gateway';
import { SocketRoomService } from './socket-room.service';
import { FriendModule } from 'src/modules/friend/friend.module';
import { SocketFriendService } from './socket-friend.service';

@Module({
  providers: [SocketGateway, SocketRoomService, SocketFriendService],
  exports: [
    SocketGateway,
    SocketRoomService,
    SocketFriendService
  ],
  imports: [
    AuthModule,
    UserModule,
    FriendModule
  ]
})
export class SocketModule {}
