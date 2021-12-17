import { ConflictException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
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
    const user = await this.userModel
      .findOne({ username: dto.username.toLowerCase().trim() })
      .select('-friends');

    if (!user) {
      // @ts-ignore
      return new UnauthorizedException("User not exits");
    }

    if (!bcrypt.compareSync(dto.password, user.password)) {
      return new UnauthorizedException("Password incorrect");
    }

    const token = this.signUser(user.username, 'user');
    user.password = undefined;

    return {
      ...user.toJSON(),
      token
    }
  }

  async signUp(dto: SignUpDto) {
    let user = await this.userModel
      .findOne({ username: dto.username.trim() })
      .select('-friends');

    if (user) {
      return new ConflictException("User exits");
    }

    const createUser = new this.userModel({
      name: dto.name,
      username: dto.username.toLowerCase().trim(),
      password: bcrypt.hashSync(dto.password, 12)
    });
    
    if (!(user = await createUser.save())) {
      return new InternalServerErrorException("Create user error");
    }

    const token = this.signUser(dto.username, 'user');
    user.password = undefined;

    return {
      ...user.toJSON(),
      token
    }
  }

  signUser(user: string, type: string) {
    return this.jwtService.sign({
      user,
      type
    })
  }

  verifyJwt(token: string) {
    return this.jwtService.verify(
      token,
      {
        ignoreExpiration: false,
        secret: process.env.JWT_SECRET
      }
    )
  }
}
