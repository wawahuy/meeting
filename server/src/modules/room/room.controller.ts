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

  @Get('getOrCreateByUser')
  @ApiQuery({ name: 'userId' })
  async getOrCreateByUser(
    @Res() res: Response,
    @GetUser() user: UserDocument,
    @Query('userId') userId: string
  ) {
    let room = await this.roomService.getRoomByUserTwoMember(user._id, userId);
    if (!room) {
      room = await this.roomService.create(user._id, { users: [userId] });
    } else {
      await this.roomService.orderTop(room._id);
    }

    let status = HttpStatus.OK;
    if (room instanceof HttpException) {
      status = (<any>room).status;
      res.status(status).json(room);
      return;
    } else {
      room = await this.roomService.get(room._id);
    }

    const r = {
      roomDetail: room,
      messageLasted: null
    };

    this.socketRoomService.emitCreateUpdateRoom(r);

    res.status(status).json(r);
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
    } else {
      await this.roomService.orderTop(room._id);
    }

    let status = HttpStatus.OK;
    if (room instanceof HttpException) {
      status = (<any>room).status;
      res.status(status).json(room);
      return;
    } else {
      room = await this.roomService.get(room._id);
    }

    const r = {
      roomDetail: room,
      messageLasted: null
    };

    this.socketRoomService.emitCreateUpdateRoom(r);

    res.status(status).json(r);
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

    let result = [];
    for(let item of r.items) {
      result.push({
        roomDetail: item,
        messageLasted: null
      })
    }

    if (result) {
      res.status(HttpStatus.OK).json({
        total: r.total,
        items: result
      });
    } else {
      return new InternalServerErrorException();
    }
  }
}
