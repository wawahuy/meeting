import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId, Schema as MSchema } from 'mongoose';
import { User } from './user.schema';

export type RoomDocument = Room & Document;

@Schema({
  timestamps: true,
  _id: true,
})
export class Room {
  @Prop({ 
    type: MSchema.Types.ObjectId,
    ref: Room.name
  })
  room: any;

  @Prop({ 
    type: MSchema.Types.ObjectId,
    ref: User.name
  })
  user: any;
}

export const RoomSchema = SchemaFactory.createForClass(Room);