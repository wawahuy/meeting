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

  @Prop({ 
    type: MSchema.Types.String,
    index: true
  })
  name: string;

  @Prop({ type: MSchema.Types.String })
  avatar: string;

  @Prop({ 
    type: [MSchema.Types.String],
    index: true
  })
  sockets: string[];

  @Prop({ 
    type: MSchema.Types.Date,
    index: true
  })
  onlineLasted: Date;

  @Prop({ 
    type: [MSchema.Types.ObjectId],
    index: true,
    ref: User.name
  })
  friends: any[];
}

export const UserSchema = SchemaFactory.createForClass(User);