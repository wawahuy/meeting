import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as moment from 'moment';
import { Document, ObjectId, Schema as MSchema } from 'mongoose';
import { User } from './user.schema';

export type RoomDocument = Room & Document;

@Schema({
  _id: false
})
export class RoomUser {
  @Prop({ 
    type: MSchema.Types.ObjectId,
    index: true,
    ref: User.name
  })
  user: any;

  @Prop({ 
    type: MSchema.Types.String,
    index: true
  })
  nickName: string;
}

const RoomUserSchema = SchemaFactory.createForClass(RoomUser);

@Schema({
  timestamps: true,
  _id: true,
})
export class Room {
  @Prop({ 
    type: MSchema.Types.String,
    index: true
  })
  name: string;

  @Prop({ 
    type: MSchema.Types.Date,
    index: true
  })
  orderTime: string;

  @Prop({ 
    type: [RoomUserSchema],
    index: true
  })
  users: RoomUser[];

  @Prop({ 
    type: MSchema.Types.ObjectId,
    index: true,
    ref: 'Message'
  })
  messageLasted: any;
}

export const RoomSchema = SchemaFactory.createForClass(Room);