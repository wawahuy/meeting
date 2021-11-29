import { Module } from '@nestjs/common';
import { SchemaModule } from 'src/schema/schema.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [SchemaModule],
  controllers: [UserController],
  providers: [UserService]
})
export class UserModule {}
