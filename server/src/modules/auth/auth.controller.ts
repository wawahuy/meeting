import { Body, Controller, Get, HttpStatus, Post, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { SignInDto, SignUpDto } from './dto/auth.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {

  constructor(
    private authService: AuthService
  ) {
  }

  @Post('signIn')
  async signIn(
    @Res() res: Response,
    @Body() dto: SignInDto
  ) {
    const token = await this.authService.signIn(dto);
    res.status(HttpStatus.OK).json({ token });
  }

  @Post('signUp')
  async signUp(
    @Res() res: Response,
    @Body() dto: SignUpDto
  ) {
    const token = await this.authService.signUp(dto);
    res.status(HttpStatus.OK).json({ token });
  }
}
