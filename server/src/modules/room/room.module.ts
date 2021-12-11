import { Module } from '@nestjs/common';
import { RoomService } from './room.service';
import { RoomController } from './room.controller';
import { SchemaModule } from 'src/schema/schema.module';

@Module({
  providers: [RoomService],
  controllers: [RoomController],
  imports: [
    SchemaModule
  ]
})
export class RoomModule {}
