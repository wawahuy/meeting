import { Module } from '@nestjs/common';
import { SchemaModule } from 'src/schema/schema.module';
import { MessageController } from './message.controller';
import { MessageService } from './message.service';

@Module({
  imports: [
    SchemaModule
  ],
  controllers: [MessageController],
  providers: [MessageService]
})
export class MessageModule {}
