import { Logger, Module, OnModuleInit } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { SchemaModule } from './schema/schema.module';
import { SocketModule } from './socket/socket.module';
import { RoomModule } from './modules/room/room.module';
import { MessageModule } from './modules/message/message.module';
import { UserService } from './modules/user/user.service';
import { FriendModule } from './modules/friend/friend.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    SchemaModule,
    SocketModule,
    RoomModule,
    MessageModule,
    FriendModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements OnModuleInit {

  constructor(
    private userService: UserService
  ) {}

  async onModuleInit() {
    await this.userService.clearAllSocket();
    Logger.log('clear all socket ids!')
  }
}