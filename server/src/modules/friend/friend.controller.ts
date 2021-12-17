import { Response } from 'express';
import { Controller, Get, Param, Post, UseGuards, Res, HttpStatus, ConflictException } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserDocument } from 'src/schema/user.schema';
import { GetUser } from 'src/utils/get-user.decorator';
import { JwtAuthGuard } from 'src/utils/guards/jwt-guards';
import { FriendService } from './friend.service';

@ApiTags('friend')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('friend')
export class FriendController {

  constructor(
    private friendService: FriendService
  ) {
  }

  @Get('search')
  getFriendCurrent(
    @GetUser() user: UserDocument
  ) {
  }

  @Get('has/:id')
  async hasFriend(
    @Res() res: Response,
    @GetUser() user: UserDocument,
    @Param('id') id: string
  ) {
    const u = await this.friendService.get(user._id, id);
    res.status(HttpStatus.OK).json(!!u);
  }

  @Get('add/:id')
  async addFriend(
    @Res() res: Response,
    @GetUser() user: UserDocument,
    @Param('id') id: string
  ) {
    if (!!(await this.friendService.get(user._id, id))) {
      const e = new ConflictException();
      res.status((<any>e).status).json(e);
    }
    const result = await this.friendService.add(user._id, id);
    res.status(HttpStatus.OK).json(result.modifiedCount);
  }

  @Post('remove/:id')
  removeFriend(
    @GetUser() user: UserDocument,
  ) {
  }
}
