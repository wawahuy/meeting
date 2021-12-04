import { Body, Controller, Get, HttpException, HttpStatus, Post, Res } from '@nestjs/common';
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
    const r = await this.authService.signIn(dto);
    let status = HttpStatus.OK;
    if (r instanceof HttpException) {
      status = (<any>r).status;
    }
    res.status(status).json(r);
  }

  @Post('signUp')
  async signUp(
    @Res() res: Response,
    @Body() dto: SignUpDto
  ) {
    const r = await this.authService.signUp(dto);
    let status = HttpStatus.OK;
    if (r instanceof HttpException) {
      status = (<any>r).status;
    }
    res.status(status).json(r);
  }
}
