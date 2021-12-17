import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from 'src/schema/user.schema';

@Injectable()
export class FriendService {

  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>
  ) {
  }

  async get(userIdHost: string, userId: string) {
    return await this.userModel.findOne({
      _id: new Types.ObjectId(userIdHost),
      friends: new Types.ObjectId(userId)
    })
  }

  async add(userIdHost: string, userId: string) {
    return await this.userModel.updateOne(
      {
        _id: new Types.ObjectId(userIdHost)
      },
      {
        $push: {
          friends: new Types.ObjectId(userId)
        }
      }
    )
  }

  async remove(userIdHost: string, userId: string) {
    return await this.userModel.updateOne(
      {
        _id: new Types.ObjectId(userIdHost)
      },
      {
        $pull: {
          friends: new Types.ObjectId(userId)
        }
      }
    )
  }

  async getFriendOnline(userId: string): Promise<UserDocument> {
    const r = await this.userModel.aggregate([
      {
        $match: {
          _id: new Types.ObjectId(userId)
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'friends',
          foreignField: '_id',
          as: 'friends'
        }
      },
      {
        $unwind: {
          path: "$friends",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $match: {
          'friends.sockets.0': { $exists: true }
        }
      },
      {
        $group: {
          _id: '$_id',
          friends: {
            $push: "$friends"
          }
        }
      },
    ])

    return r?.[0];
  }
}
