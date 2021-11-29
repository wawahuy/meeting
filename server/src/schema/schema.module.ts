import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MessageContainer, MessageContainerSchema } from './message-container.schema';
import { Message, MessageSchema } from './message.schema';
import { UserSchema, User } from './user.schema';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URI),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Message.name, schema: MessageSchema },
      { name: MessageContainer.name, schema: MessageContainerSchema },
    ])
  ],
  exports: [
    MongooseModule
  ]
})
export class SchemaModule {}
