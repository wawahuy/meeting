import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId, Schema as MSchema } from 'mongoose';
import { User } from './user.schema';

export type RoomUserDocument = RoomUser & Document;

@Schema({
  timestamps: true,
  _id: true,
})
export class RoomUser {
  @Prop({ 
    type: MSchema.Types.String,
  })
  name: string;
}

export const RoomUserSchema = SchemaFactory.createForClass(RoomUser);