import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Get, HttpException, HttpStatus, InternalServerErrorException, Post, Query, Res, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/utils/guards/jwt-guards';
import { RoomService } from './room.service';
import { GetUser } from 'src/utils/get-user.decorator';
import { UserDocument } from 'src/schema/user.schema';
import { CreateRoomDto } from './dto/room.dto';
import e, { Response } from 'express';
import { RoomDocument } from 'src/schema/room.schema';
import { SocketRoomService } from 'src/socket/socket-room.service';

@ApiTags('room')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('room')
export class RoomController {
  
  constructor(
    private roomService: RoomService,
    private socketRoomService: SocketRoomService
  ) {
  }

  @Post('create') 
  async create(
    @Res() res: Response,
    @GetUser() user: UserDocument,
    @Body() dto: CreateRoomDto
  ){
    let room: RoomDocument;
    if (dto?.users?.length === 1) {
      dto.name = null;
      room = await this.roomService.getRoomByUserTwoMember(user._id, dto.users[0]);
    }

    if (!room) {
      room = await this.roomService.create(user._id, dto);
    }

    let status = HttpStatus.OK;
    if (room instanceof HttpException) {
      status = (<any>room).status;
      res.status(status).json(room);
      return;
    } else {
      room = await this.roomService.get(room._id);
    }

    if (room.users.length > 2) {
      this.socketRoomService.emitCreateUpdateRoom(room);
    }

    res.status(status).json(room);
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
    let r = await this.roomService.findPage(user._id, search, page, size);

    if (r) {
      res.status(HttpStatus.OK).json(r);
    } else {
      return new InternalServerErrorException();
    }
  }
}
