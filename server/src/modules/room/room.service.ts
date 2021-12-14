import { ConflictException, Injectable, NotAcceptableException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { AnyKeys, FilterQuery, Model, Types } from 'mongoose';
import { Room, RoomDocument } from 'src/schema/room.schema';
import { User, UserDocument } from 'src/schema/user.schema';
import { CreateRoomDto } from './dto/room.dto';

@Injectable()
export class RoomService {
  constructor(
    @InjectModel(Room.name) private roomModel: Model<RoomDocument>,
    @InjectModel(User.name) private userModel: Model<RoomDocument>,
  ) {
  }

  async getByRoomUserId(roomId: string, userId: string) {
    return await this.roomModel
      .findOne({
        _id: new Types.ObjectId(roomId),
        'users.user': new Types.ObjectId(userId)
      })
      .populate('users.user', '_id name username avatar sockets onlineLasted');
  }

  async get(roomId: string) {
    return await this.roomModel
      .findOne({
        _id: new Types.ObjectId(roomId)
      })
      .populate('users.user', '_id name username avatar sockets onlineLasted');
  }

  async getRoomByUserTwoMember(userHost: string, userRecv: string) {
    const match: FilterQuery<RoomDocument> = {
      $or: [
        {
          'users.user.0': new Types.ObjectId(userHost),
          'users.user.1': new Types.ObjectId(userRecv),
        },
        {
          'users.user.1': new Types.ObjectId(userHost),
          'users.user.0': new Types.ObjectId(userRecv),
        },
      ],
      users: { $size: 2 }
    }
    return await this.roomModel
      .findOne(match)
      .populate('users.user', '_id name username avatar sockets onlineLasted');
  }

  async create(userHost: string, d: CreateRoomDto) {
    // validate
    if (d.users.findIndex(u => u.toString() === userHost.toString()) > -1) {
      throw new ConflictException('Do not use current user id');
    }

    // get user
    let users = null;
    try {
      users = await this.userModel
        .find({
          '_id': d.users.map((uId) => new Types.ObjectId(uId))
        })
        .catch(e => null);
    } catch (e) {
    }

    if (d.users.length != users?.length) {
      throw new NotAcceptableException('User id not exists or duplicate');
    }

    // create
    const data: AnyKeys<RoomDocument>[] = [{
      name: d.name,
      users: [
        {
          user: new Types.ObjectId(userHost),
        },
        ...users.map(user => ({
          user: user._id
        }))
      ]
    }]

    const result = await this.roomModel.create(data);
    return result?.[0];
  }

  async findPage(userHost: string, search: string, page: number, size: number) {
    let match: FilterQuery<RoomDocument> = {};
    if (search) {
      search = search.toLowerCase().trim();
      match = {
        $or: [
          {
            name: { 
              $regex: '.*' + search + '.*',
              $options: 'i'
            }
          },
          {
            users: {
              $elemMatch: {
                'user._id': { $ne: new Types.ObjectId(userHost) },
                'user.name': {
                  $regex: '.*' + search + '.*',
                  $options: 'i'
                }
              }
            }
          },
          {
            users: {
              $elemMatch: {
                'user._id': { $ne: new Types.ObjectId(userHost) },
                'user.username': {
                  $regex: '.*' + search + '.*',
                  $options: 'i'
                }
              }
            }
          }
        ]
      }
    }
    return await this.roomModel
      .aggregate([
        {
          $match: {
            'users.user': new Types.ObjectId(userHost)
          }
        },
        {
          $unwind: {
            path: "$users",
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $lookup: {
            from: 'users',
            localField: 'users.user',
            foreignField: '_id',
            as: 'tmp'
          }
        },
        {
          $unwind: {
            path: "$tmp",
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $group: {
            _id: '$_id',
            name: { $first: "$name" },
            updatedAt: { $first: "$updatedAt" },
            users: {
              $push: {
                nickName: "$users.nickName",
                user: "$tmp"
              }
            }
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
            'users.user.avatar': 1,
            'users.user.sockets': 1,
            'users.user.onlineLasted': 1,
            'updatedAt': 1,
          }
        },
        {
          $sort: {
            updatedAt: -1
          }
        },
        { $skip: Number((page - 1) * size) },
        { $limit: Number(size) }
      ])
      .catch(e => null);
  }
}
