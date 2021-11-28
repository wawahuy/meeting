import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MSchema } from 'mongoose';

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
    index: true
  })
  userIdFrom: string;

  @Prop({ 
    type: MSchema.Types.ObjectId,
    required: true,
    index: true 
  })
  userIdTo: string;

  @Prop({ 
    type: MSchema.Types.Boolean,
  })
  deleteFrom: boolean;

  @Prop({ 
    type: MSchema.Types.Boolean,
  })
  deleteTo: boolean;

  @Prop({ 
    type: MSchema.Types.Boolean,
    required: true,
    enum: Object.values(MessageType)
  })
  type: MessageType;

  @Prop({ 
    type: MSchema.Types.String,
  })
  data: string;
}

export const MessageSchema = SchemaFactory.createForClass(Message);