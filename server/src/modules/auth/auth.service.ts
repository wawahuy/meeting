import { ConflictException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as md5 from 'md5';
import { User, UserDocument } from 'src/schema/user.schema';
import { SignInDto, SignUpDto } from './dto/auth.dto';

@Injectable()
export class AuthService {

  constructor(
    private jwtService: JwtService,
    @InjectModel(User.name) private userModel: Model<UserDocument>
  ) {
  }

  async signIn(dto: SignInDto) {
    const user = await this.userModel.findOne({ username: dto.username })

    if (!user) {
      return new UnauthorizedException("User not exits");
    }

    if (md5(user.password) === dto.password) {
      return new UnauthorizedException("Password incorrect");
    }

    return this.signUser(user.username, 'user');
  }

  async signUp(dto: SignUpDto) {
    const user = await this.userModel.findOne({ username: dto.username })

    if (user) {
      return new ConflictException("User exits");
    }

    const createUser = new this.userModel({
      username: dto.username,
      password: md5(dto.password)
    });
    
    if (!await createUser.save()) {
      return new InternalServerErrorException("Create user error");
    }

    return this.signUser(dto.username, 'user');
  }

  signUser(user: string, type: string) {
    return this.jwtService.sign({
      user,
      type
    })
  }
}
