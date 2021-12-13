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

  async findPage(roomId: string, search: string, page: number, size: number) {
    let match: FilterQuery<MessageDocument> = {
      // room: new Ty
    };
    if (search) {
      search = search.toLowerCase().trim();
      match = {
        $or: [
          {
            username: search
          },
          {
            name: { 
              $regex: '.*' + search + '.*',
              $options: 'i'
            }
          }
        ]
      }
    }

    return await this.messageModel.find(match)
      .select('-password -__v')
      .skip((page - 1) * size)
      .limit(size)
      .catch(e => null);
  }
}
