import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SignInDto, SignUpDto } from './dto/auth.dto';

@Injectable()
export class AuthService {

  test = [
    { u: 'admin', p: 'admin' }
  ]

  constructor(
    private jwtService: JwtService
  ) {
  }

  signIn(dto: SignInDto) {
    const user = this.test.find(item => item.u === dto.username);

    if (!user) {
      return new UnauthorizedException("User not exits");
    }

    if (user.p !== dto.password) {
      return new UnauthorizedException("Password incorrect");
    }

    return this.signUser(1, 'user');
  }

  signUp(dto: SignUpDto) {
  }

  signUser(userId: number, type: string) {
    return this.jwtService.sign({
      user: userId,
      type
    })
  }
}
