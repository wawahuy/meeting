import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId, Schema as MSchema } from 'mongoose';

export type MessageContainerDocument = MessageContainer & Document;

@Schema({
  timestamps: true,
  _id: true,
})
export class MessageContainer {
  @Prop({ 
    type: MSchema.Types.ObjectId,
    required: true,
    index: true
  })
  userAId: ObjectId;

  @Prop({ 
    type: MSchema.Types.ObjectId,
    required: true,
    index: true 
  })
  userBId: ObjectId;

  @Prop({ 
    type: MSchema.Types.Boolean,
  })
  deleteA: boolean;

  @Prop({ 
    type: MSchema.Types.Boolean,
  })
  deleteB: boolean;
}

export const MessageContainerSchema = SchemaFactory.createForClass(MessageContainer);