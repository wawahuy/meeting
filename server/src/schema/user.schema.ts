import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MSchema } from 'mongoose';

export type UserDocument = User & Document;

@Schema({
  timestamps: true,
  _id: true,
})
export class User {
  @Prop({ 
    type: MSchema.Types.String, 
    required: true,
    unique: true,
    index: true
  })
  username: string;

  @Prop({ type: MSchema.Types.String })
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);