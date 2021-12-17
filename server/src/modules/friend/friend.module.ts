import { Module } from '@nestjs/common';
import { FriendService } from './friend.service';
import { FriendController } from './friend.controller';
import { SchemaModule } from 'src/schema/schema.module';

@Module({
  imports: [
    SchemaModule
  ],
  exports: [
    FriendService
  ],
  providers: [FriendService],
  controllers: [FriendController]
})
export class FriendModule {}
