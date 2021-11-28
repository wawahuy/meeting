import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { SchemaModule } from './schema/schema.module';
import { SocketModule } from './socket/socket.module';
import { MessageModule } from './modules/message/message.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    SchemaModule,
    SocketModule,
    MessageModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}