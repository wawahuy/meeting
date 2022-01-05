import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Types, UpdateQuery, UpdateWithAggregationPipeline } from 'mongoose';
import { Message, MessageDocument, MessageReceiverStatus } from 'src/schema/message.schema';

@Injectable()
export class MessageService {

  constructor(
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>
  ) {
  }

  async checkRoomAndMessage(roomId: string, messageId: string) {
    const result = await this.messageModel
      .findOne({ 
        _id: new Types.ObjectId(messageId),
        room: new Types.ObjectId(roomId),
      })
    
    return !!result;
  }

  async get(messageId: string) {
    return await this.messageModel
      .findOne({ _id: new Types.ObjectId(messageId) })
      .populate('user', '-password -friends')
      .populate('statusReceiver.user', 'username name avatar')
      .populate('messageReply', '-statusReceiver -messageReply')
      .populate('messageReply.user', 'username name avatar')
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
      .skip(Number((page - 1)) * size)
      .limit(Number(size))
      .populate('user', '-password -friends')
      .populate('statusReceiver.user', 'username name avatar')
      .populate('messageReply', '-statusReceiver -messageReply')
      .populate('messageReply.user', 'username name avatar')
      .catch(e => null);
  }

  async addOrUpdateReceiver(messageId: string, userId: string, type: MessageReceiverStatus) {
    const m = await this.messageModel.findOne({ 
      _id: new Types.ObjectId(messageId),
      'statusReceiver.user': new Types.ObjectId(userId)
    });

    let match: FilterQuery<MessageDocument>;
    let upd: UpdateQuery<MessageDocument> | UpdateWithAggregationPipeline;
    if (!m) {
      match = {
        _id: new Types.ObjectId(messageId)
      };
      upd = {
        $push: {
          statusReceiver: {
            user: new Types.ObjectId(userId),
            type
          }
        }
      }
    } else {
      match = {
        _id: new Types.ObjectId(messageId),
        'statusReceiver.user': new Types.ObjectId(userId)
      };
      upd = {
        $set: {
          'statusReceiver.$.type': type
        }
      }
    }

    await this.messageModel.updateOne(match, upd);
  }
}
