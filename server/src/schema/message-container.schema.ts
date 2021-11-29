import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId, Schema as MSchema } from 'mongoose';
import { User } from './user.schema';

export type MessageContainerDocument = MessageContainer & Document;

@Schema({
  timestamps: true,
  _id: true,
})
export class MessageContainer {
  @Prop({ 
    type: MSchema.Types.ObjectId,
    required: true,
    index: true,
    ref: User.name
  })
  userA: any;

  @Prop({ 
    type: MSchema.Types.ObjectId,
    required: true,
    index: true,
    ref: User.name
  })
  userB: any;

  @Prop({ 
    type: MSchema.Types.Boolean,
  })
  deleteA: boolean;

  @Prop({ 
    type: MSchema.Types.Boolean,
  })
  deleteB: boolean;
}

export const MessageContainerSchema = SchemaFactory.createForClass(MessageContainer);