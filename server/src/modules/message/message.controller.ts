import { BadRequestException, Controller, ForbiddenException, Get, HttpStatus, InternalServerErrorException, Query, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { UserDocument } from 'src/schema/user.schema';
import { GetUser } from 'src/utils/get-user.decorator';
import { JwtAuthGuard } from 'src/utils/guards/jwt-guards';
import { RoomService } from '../room/room.service';
import { MessageService } from './message.service';

@ApiTags('message')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('message')
export class MessageController {

  constructor(
    private messageService: MessageService,
    private roomService: RoomService
  ) {
  }

  @Get('search')
  @ApiQuery({ name: 'roomId', required: true })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'size', required: false })
  async search(
    @Res() res: Response,
    @GetUser() user: UserDocument,
    @Query('roomId') roomId: string,
    @Query('search') search: string,
    @Query('page') page: number = 1,
    @Query('size') size: number = 10,
  ) {
    const room = await this.roomService.getByRoomUserId(roomId, user._id);
    if (!room) {
      throw new ForbiddenException();
    }

    const result = await this.messageService.findPage(roomId, search, page, size);
    if (result) {
      res.status(HttpStatus.OK).json(result);
    } else {
      return new InternalServerErrorException();
    }
  }
}
