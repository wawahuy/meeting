import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserDocument } from '../../schema/user.schema';
import { GetUser } from '../../utils/get-user.decorator';
import { JwtAuthGuard } from '../../utils/guards/jwt-guards';

@ApiTags('user')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('user')
export class UserController {

  constructor() {
  }

  @Get('current')
  current(@GetUser() user: UserDocument) {
    user.password = undefined;
    return user;
  }
}
