import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { AnyKeys, AnyObject, FilterQuery, Model, Types, _UpdateQueryDef } from 'mongoose';
import { MessageContainer, MessageContainerDocument } from 'src/schema/message-container.schema';
import { Message, MessageDocument } from 'src/schema/message.schema';
import { User, UserDocument } from 'src/schema/user.schema';

@Injectable()
export class MessageService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(MessageContainer.name) private messageContainerModel: Model<MessageContainerDocument>,
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
  ) {
  }

  async getOrCreateMessageContainerByUser(userA: string, userB: string) {
    const uA = new Types.ObjectId(userA);
    const uB = new Types.ObjectId(userB);
    return await this.messageContainerModel.updateOne(
      { 
        $or: [
          {
            userA: uA,
            userB: uB,
          },
          {
            userA: uB,
            userB: uA,
          }
        ]
      },
      { 
        $set: {
          userA: uA,
          userB: uB,
          deleteA: false,
          deleteB: false,
        }
      },
      { upsert: true }
    )
    .catch(e => null)
  }

  async getMessageContainer(user: string, page: number, size: number) {
    let uId = new Types.ObjectId(user);
    let match: FilterQuery<MessageContainerDocument> = {
      $or: [
        {
          userA: uId,
          deleteA: false
        },
        {
          userB: uId,
          deleteB: false
        },
      ]
    };

    return await this.messageContainerModel.find(match)
      .sort({ updatedAt: -1 })
      .skip((page - 1) * size)
      .limit(size)
      .populate('userA')
      .populate('userB')
      .catch(e => null)
  }

  async deleteMessageContainer(id: string, userId: string) {
    const mId = new Types.ObjectId(id);
    const messageContainer = await this.messageContainerModel.findOne({ _id: mId})
      .catch(e => null);

    if (!messageContainer) {
      return new InternalServerErrorException();
    }

    let update: AnyKeys<_UpdateQueryDef<MessageContainerDocument>> & AnyObject = {};
    if (messageContainer.userA?.toString() == userId?.toString()) {
      update = { deleteA: true };
    } else {
      update = { deleteB: true };
    }
    
    const result = await this.messageContainerModel.updateOne(
      { _id: mId },
      { 
        $set: update
      }
    )
    .catch(e => null);

    if (!result?.modifiedCount) {
      return new InternalServerErrorException();
    }

    return { status: true }
  }


}
