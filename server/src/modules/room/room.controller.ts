import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Get, HttpException, HttpStatus, InternalServerErrorException, Post, Query, Res, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/utils/guards/jwt-guards';
import { RoomService } from './room.service';
import { GetUser } from 'src/utils/get-user.decorator';
import { UserDocument } from 'src/schema/user.schema';
import { CreateRoomDto } from './dto/room.dto';
import e, { Response } from 'express';

@ApiTags('room')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('room')
export class RoomController {
  
  constructor(
    private roomService: RoomService
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
    }

    let status = HttpStatus.OK;
    if (room instanceof HttpException) {
      status = (<any>room).status;
      res.status(status).json(room);
      return;
    } else {
      room = await this.roomService.get(room._id);
    }

    res.status(status).json({
      room,
      messageLasted: null
    });
  }

  @Post('create') 
  async create(
    @Res() res: Response,
    @GetUser() user: UserDocument,
    @Body() dto: CreateRoomDto
  ){
    let room = await this.roomService.create(user._id, dto);

    let status = HttpStatus.OK;
    if (room instanceof HttpException) {
      status = (<any>room).status;
      res.status(status).json(room);
      return;
    } else {
      room = await this.roomService.get(room._id);
    }

    res.status(status).json({
      room,
      messageLasted: null
    });
  }

  @Get('search')
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'size', required: false })
  async search(
    @Res() res: Response,
    @Query('search') search: string,
    @Query('page') page: number = 1,
    @Query('size') size: number = 10,
  ) {
    let r = await this.roomService.findPage(search, page, size);

    let result = [];
    for(let item of r) {
      result.push({
        rom: item,
        messageLasted: null
      })
    }

    if (result) {
      res.status(HttpStatus.OK).json(result);
    } else {
      return new InternalServerErrorException();
    }
  }
}
