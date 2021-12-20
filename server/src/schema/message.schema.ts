import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId, Schema as MSchema } from 'mongoose';
import { Room } from './room.schema';
import { User } from './user.schema';

export enum MessageReceiverStatus {
  Received = 1,
  Watched = 2
}

@Schema({
  _id: false
})
export class StatusReceiver {
  @Prop({ 
    type: MSchema.Types.ObjectId,
    index: true,
    ref: User.name
  })
  user: any;

  @Prop({ 
    type: MSchema.Types.Number,
    required: true,
    enum: Object.values(MessageReceiverStatus).filter(v => Number(v))
  })
  type: MessageReceiverStatus;
}

const StatusReceiverSchema = SchemaFactory.createForClass(StatusReceiver);

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
    ref: Room.name
  })
  room: any;

  @Prop({ 
    type: MSchema.Types.ObjectId,
    required: true,
    index: true,
    ref: User.name
  })
  user: any;

  @Prop({ type: [StatusReceiverSchema] })
  statusReceiver: StatusReceiver[];

  @Prop({ 
    type: MSchema.Types.Number,
    required: true,
    enum: Object.values(MessageType).filter(v => Number(v))
  })
  type: MessageType;

  @Prop({ 
    type: MSchema.Types.String,
  })
  msg: string;
}

export const MessageSchema = SchemaFactory.createForClass(Message);