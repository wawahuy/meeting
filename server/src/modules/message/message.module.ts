import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { SchemaModule } from 'src/schema/schema.module';
import { RoomModule } from '../room/room.module';

@Module({
  providers: [MessageService],
  controllers: [MessageController],
  imports: [
    SchemaModule,
    RoomModule
  ] 
})
export class MessageModule {}
