import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserDocument } from '../schema/user.schema';
import { GetUser } from '../utils/get-user.decorator';
import { JwtAuthGuard } from '../utils/guards/jwt-guards';

@ApiTags('user')
@Controller('user')
export class UserController {

  constructor() {
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('current')
  current(@GetUser() user: UserDocument) {
    user.password = undefined;
    return user;
  }
}
