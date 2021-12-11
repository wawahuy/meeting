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

  @Prop({ 
    type: MSchema.Types.String,
    required: true,
  })
  password: string;

  @Prop({ type: MSchema.Types.String })
  name: string;

  @Prop({ type: MSchema.Types.String })
  avatar: string;

  @Prop({ 
    type: MSchema.Types.String,
    index: true
  })
  socketId: string;

  @Prop({ 
    type: MSchema.Types.Date,
    index: true
  })
  socketDate: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);