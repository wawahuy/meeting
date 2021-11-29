import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId, Schema as MSchema } from 'mongoose';
import { MessageContainer } from './message-container.schema';
import { User } from './user.schema';

export enum MessageType {
  Text = 1,
  Call = 2,
  Image = 3,
  Video = 4
}

export type MessageDocument = Message & Document;

@Schema({
  timestamps: true,
  _id: true,
})
export class Message {
  @Prop({ 
    type: MSchema.Types.ObjectId,
    required: true,
    index: true,
    ref: MessageContainer.name
  })
  messageContainer: any;

  @Prop({ 
    type: MSchema.Types.ObjectId,
    required: true,
    index: true,
    ref: User.name
  })
  userFrom: any;

  @Prop({ 
    type: MSchema.Types.ObjectId,
    required: true,
    index: true,
    ref: User.name
  })
  userTo: any;

  @Prop({ 
    type: MSchema.Types.Boolean,
  })
  deleteFrom: boolean;

  @Prop({ 
    type: MSchema.Types.Boolean,
  })
  deleteTo: boolean;

  @Prop({ 
    type: MSchema.Types.Number,
    required: true,
    enum: Object.values(MessageType).filter(v => Number(v))
  })
  type: MessageType;

  @Prop({ 
    type: MSchema.Types.String,
  })
  data: string;
}

export const MessageSchema = SchemaFactory.createForClass(Message);