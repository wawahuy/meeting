import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as moment from 'moment';
import { FilterQuery, Model, Types } from 'mongoose';
import { DataPage } from 'src/models/common';
import { User, UserDocument } from 'src/schema/user.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>
  ) {
  }

  async getByUsername(username: string): Promise<UserDocument> {
    return await this.userModel.findOne({ username }).catch(e => null);
  }

  async findPage(excludeUserId: string, search: string, page: number, size: number) {
    let match: FilterQuery<UserDocument> = {
      _id: {
        $nin: [new Types.ObjectId(excludeUserId)]
      }
    };
    if (search) {
      search = search.toLowerCase().trim();
      match = {
        ...match,
        $or: [
          {
            username: { 
              $regex: '.*' + search + '.*',
              $options: 'i'
            }
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

    const total = await this.userModel.find(match).count();

    const items = await this.userModel.find(match)
      .select('-password -__v')
      .skip(Number((page - 1) * size))
      .limit(Number(size))
      .catch(e => null);

    const data: DataPage<typeof items> = {
      total,
      items
    };

    return data;
  }

  async pushSocketId(userId: string, socketId: string) {
    return await this.userModel.updateOne(
      {
        _id: new Types.ObjectId(userId)
      },
      {
        $push: {
          sockets: socketId
        }
      }
    )
  }

  async pullSocketId(userId: string, socketId: string) {
    return await this.userModel.updateOne(
      {
        _id: new Types.ObjectId(userId)
      },
      {
        $pull: {
          sockets: socketId
        },
        $set: {
          onlineLasted: moment().toDate()
        }
      }
    )
  }

  async clearAllSocket() {
    return await this.userModel.updateMany(
      {
        'sockets.0': { $exists: true }
      },
      {
        $set: {
          sockets: []
        }
      }
    )
  }
  
}
