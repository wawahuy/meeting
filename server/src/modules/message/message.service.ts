import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { Message, MessageDocument } from 'src/schema/message.schema';

@Injectable()
export class MessageService {

  constructor(
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>
  ) {
  }

  async findPage(search: string, page: number, size: number) {
    let match: FilterQuery<MessageDocument> = {};
    if (search) {
      match = {
        $or: [
          {
            name: { 
              $regex: '.*' + search + '.*' 
            }
          },
          {
            'users.user.name': {
              $regex: '.*' + search + '.*' 
            }
          },
          {
            'users.user.username': search
          }
        ]
      }
    }
    return await this.messageModel
      .aggregate([
        {
          $lookup: {
            from: 'users',
            localField: 'users.user',
            foreignField: '_id',
            as: 'users.user'
          }
        },
        {
          $match: match
        },
        {
          $project: {
            _id: 1,
            name: 1,
            'users.user._id': 1,
            'users.user.name': 1,
            'users.user.username': 1,
            'users.user.socketId': 1,
            'users.user.socketDate': 1,
            'updatedAt': 1,
          }
        },
        {
          $sort: {
            updatedAt: -1
          }
        },
        { $skip: (page - 1) * size },
        { $limit: Number(size) }
      ])
      .catch(e => null);
  }
}
