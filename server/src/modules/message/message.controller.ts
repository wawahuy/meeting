import { Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/utils/guards/jwt-guards';

@ApiBearerAuth()
@ApiTags('message')
@UseGuards(JwtAuthGuard)
@Controller('message')
export class MessageController {

  constructor() {
  }

  @Get()
  getAll() {
  }

  @Post()
  createMessage(@Param() id: string) {
  }

  @Delete('/:id')
  @ApiParam({ name: 'id' })
  deleteMessage(@Param() id: string) {
  }

  @Get(':idMessage/content')
  @ApiParam({ name: 'idMessage' })
  getMessageContent(@Param() idMessage: string) {
  }

  @Post(':idMessage/content')
  @ApiParam({ name: 'idMessage' })
  sendMessageContent(@Param() idMessage: string) {
  }

  @Delete(':idMessage/content/:id')
  @ApiParam({ name: 'idMessage' })
  @ApiParam({ name: 'id' })
  deleteMessageContent(@Param() idMessage: string, @Param() id: string) {
  }
}
