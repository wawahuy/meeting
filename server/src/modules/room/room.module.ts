import { forwardRef, Module } from '@nestjs/common';
import { RoomService } from './room.service';
import { RoomController } from './room.controller';
import { SchemaModule } from 'src/schema/schema.module';
import { SocketModule } from 'src/socket/socket.module';

@Module({
  providers: [RoomService],
  controllers: [RoomController],
  imports: [
    SchemaModule,
    forwardRef(() => SocketModule)
  ],
  exports: [
    RoomService
  ]
})
export class RoomModule {}
