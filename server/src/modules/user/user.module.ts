import { Module } from '@nestjs/common';
import { SchemaModule } from 'src/schema/schema.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [SchemaModule],
  exports: [UserService],
  controllers: [UserController],
  providers: [UserService]
})
export class UserModule {}
