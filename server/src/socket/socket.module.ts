import { Module } from '@nestjs/common';
import { AuthModule } from 'src/modules/auth/auth.module';
import { UserModule } from 'src/modules/user/user.module';
import { SocketGateway } from './socket.gateway';
import { SocketRoomService } from './socket-room.service';

@Module({
  providers: [SocketGateway, SocketRoomService],
  exports: [
    SocketGateway,
    SocketRoomService
  ],
  imports: [
    AuthModule,
    UserModule
  ]
})
export class SocketModule {}
