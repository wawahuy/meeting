import { Body, Controller, Delete, Get, HttpStatus, InternalServerErrorException, Param, Post, Query, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { UserDocument } from 'src/schema/user.schema';
import { GetUser } from 'src/utils/get-user.decorator';
import { JwtAuthGuard } from 'src/utils/guards/jwt-guards';
import { CreateMessageDto } from './dto/message.dto';
import { MessageService } from './message.service';

@ApiBearerAuth()
@ApiTags('message')
@UseGuards(JwtAuthGuard)
@Controller('message')
export class MessageController {

  constructor(
    private messageService: MessageService
  ) {
  }

  @Get()
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'size', required: false })
  async getAll(
    @Res() res: Response,
    @GetUser() user: UserDocument,
    @Query('page') page: number = 1,
    @Query('size') size: number = 10,
  ) {
    const hostId = user._id;
    const result = await this.messageService.getMessageContainer(hostId, page, size);
    if (result) {
      res.status(HttpStatus.OK).json(result);
    } else {
      throw new InternalServerErrorException();
    }
  }

  @Post()
  async createMessage(
    @Res() res: Response,
    @GetUser() user: UserDocument,
    @Body() dto: CreateMessageDto
  ) {
    const { userId } = dto;
    const hostId = user._id;
    const messageContainer = await this.messageService.getOrCreateMessageContainerByUser(hostId, userId);

    if (messageContainer?.modifiedCount) {
      res.status(HttpStatus.OK).json({ status: true });
    } else {
      throw new InternalServerErrorException();
    }
  }

  @Delete('/:id')
  @ApiParam({ name: 'id' })
  async deleteMessage(
    @GetUser() user: UserDocument,
    @Param() id: string
  ) {
    return await this.messageService.deleteMessageContainer(id, user._id);
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
