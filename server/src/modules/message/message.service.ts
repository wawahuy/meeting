import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Types } from 'mongoose';
import { Message, MessageDocument } from 'src/schema/message.schema';

@Injectable()
export class MessageService {

  constructor(
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>
  ) {
  }

  async get(messageId: string) {
    return await this.messageModel
      .findOne({ _id: new Types.ObjectId(messageId) })
      .populate('user', '-password -friends')
      .populate('statusReceiver.user', '-password -friends')
  }

  async create(data: MessageDocument) {
    return await this.messageModel.create([data]);
  }

  async findPage(userHost: string, roomId: string, search: string, page: number, size: number) {
    let match: FilterQuery<MessageDocument> = {
      room: new Types.ObjectId(roomId),
      'users.user': new Types.ObjectId(userHost)
    };

    if (search) {
      search = search.toLowerCase().trim();
      match = {
        ...match,
        msg: {
          $regex: '.*' + search + '.*',
          $options: 'i'
        }
      }
    }

    return await this.messageModel.find(match)
      .select('-password -__v')
      .sort({ createdAt: -1 })
      .skip((page - 1) * size)
      .limit(size)
      .populate('user', '-password -friends')
      .populate('statusReceiver.user', '-password -friends')
      .catch(e => null);
  }
}
