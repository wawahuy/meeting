import { Module } from '@nestjs/common';
import { AuthModule } from 'src/modules/auth/auth.module';
import { UserModule } from 'src/modules/user/user.module';
import { SocketGateway } from './socket.gateway';

@Module({
  providers: [SocketGateway],
  exports: [SocketGateway],
  imports: [
    AuthModule,
    UserModule
  ]
})
export class SocketModule {}
