import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AppService } from './app.service';
import { JwtAuthGuard } from './utils/guards/jwt-guards';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('/test')
  test(@Request() req) {
    return req.user;
  }
}
