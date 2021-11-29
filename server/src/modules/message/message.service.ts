import { ForbiddenException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { AnyKeys, AnyObject, FilterQuery, Model, Types, _UpdateQueryDef } from 'mongoose';
import { MessageContainer, MessageContainerDocument } from 'src/schema/message-container.schema';
import { Message, MessageDocument } from 'src/schema/message.schema';
import { User, UserDocument } from 'src/schema/user.schema';
import { CreateMessageContentDto } from './dto/message.dto';

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

  async getMessageContainerById(id: string): Promise<MessageContainerDocument | null> {
    return await this.messageContainerModel.findOne({ _id: new Types.ObjectId(id) })
      .catch(e => null);
  }

  async deleteMessageContainer(id: string, userId: string) {
    const mId = new Types.ObjectId(id);
    const messageContainer = await this.messageContainerModel.findOne({ _id: mId})
      .catch(e => null);

    if (!messageContainer) {
      return new InternalServerErrorException();
    }

    if (
      messageContainer.userA?.toString() !== userId?.toString() &&
      messageContainer.userB?.toString() !== userId?.toString()
    ) {
      return new ForbiddenException();
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

  async getMessageContent(messageContainerId: string, user: string, page: number, size: number) {
    let mcId = new Types.ObjectId(messageContainerId);
    let uId = new Types.ObjectId(user);
    let match: FilterQuery<MessageDocument> = {
      messageContainer: mcId,
      $or: [
        {
          userFrom: uId,
          deleteFrom: false
        },
        {
          userTo: uId,
          deleteTo: false
        },
      ]
    };

    return await this.messageModel.find(match)
      .sort({ createdAt: -1 })
      .skip((page - 1) * size)
      .limit(size)
      .catch(e => null)
  }

  async insertMessageContent(
    messageContainerId: string, 
    fromId: string, 
    toId: string, 
    dto: CreateMessageContentDto
  ) {
    const mcId = new Types.ObjectId(messageContainerId);
    const fId = new Types.ObjectId(fromId);
    const tId = new Types.ObjectId(toId);
    return await this.messageModel.insertMany([
      {
        messageContainer: mcId,
        userFrom: fId,
        userTo: tId,
        deleteFrom: false,
        deleteTo: false,
        type: dto.type,
        data: dto.data
      }
    ])
  }

  async deleteMessageContent(idMessage: string, userId: string) {
    const mId = new Types.ObjectId(idMessage);
    const message = await this.messageModel.findOne({ _id: mId})
      .catch(e => null);

    if (!message) {
      return new InternalServerErrorException();
    }

    if (
      message.userFrom?.toString() !== userId?.toString() &&
      message.userTo?.toString() !== userId?.toString()
    ) {
      return new ForbiddenException();
    }

    let update: AnyKeys<_UpdateQueryDef<MessageDocument>> & AnyObject = {};
    if (message.userFrom?.toString() == userId?.toString()) {
      update = { deleteFrom: true };
    } else {
      update = { deleteTo: true };
    }
    
    const result = await this.messageModel.updateOne(
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
