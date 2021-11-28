import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { PassportStrategy } from '@nestjs/passport';
import { Model } from "mongoose";
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User, UserDocument } from "src/schema/user.schema";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: any) {
    if (payload.user) {
      return this.userModel.findOne({ username: payload.user });
    }
    return null;
  }
}