import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { User, UserDocument } from 'src/schema/user.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>
  ) {
  }

  async findPage(search: string, page: number, size: number) {
    let match: FilterQuery<UserDocument> = {};
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

    return await this.userModel.find(match)
      .select('-password -__v')
      .skip((page - 1) * size)
      .limit(size)
      .catch(e => null);
  }
}
