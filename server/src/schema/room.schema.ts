import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId, Schema as MSchema } from 'mongoose';
import { User } from './user.schema';

export type RoomDocument = Room & Document;

@Schema({
  _id: false
})
export class RoomUser {
  @Prop({ 
    type: MSchema.Types.ObjectId,
    unique: true
  })
  user: any;

  @Prop({ 
    type: MSchema.Types.String,
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
  })
  name: string;

  @Prop({ type: [RoomUserSchema] })
  users: RoomUser[];
}

export const RoomSchema = SchemaFactory.createForClass(Room);