import { Controller, Get, HttpStatus, InternalServerErrorException, Query, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { UserDocument } from '../../schema/user.schema';
import { GetUser } from '../../utils/get-user.decorator';
import { JwtAuthGuard } from '../../utils/guards/jwt-guards';
import { UserService } from './user.service';

@ApiTags('user')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('user')
export class UserController {

  constructor(
    private userService: UserService
  ) {
  }

  @Get('current')
  current(@GetUser() user: UserDocument) {
    user.password = undefined;
    return user;
  }

  @Get('search')
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'size', required: false })
  async search(
    @Res() res: Response,
    @GetUser() user: UserDocument,
    @Query('search') search: string,
    @Query('page') page: number = 1,
    @Query('size') size: number = 10,
  ) {
    const result = await this.userService.findPage(user._id, search, page, size);
    if (result) {
      res.status(HttpStatus.OK).json(result);
    } else {
      return new InternalServerErrorException();
    }
  }
}