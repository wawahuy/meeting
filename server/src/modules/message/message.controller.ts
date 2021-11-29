import { Body, Controller, Delete, ForbiddenException, Get, HttpStatus, InternalServerErrorException, Param, Post, Query, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { MessageType } from 'src/schema/message.schema';
import { UserDocument } from 'src/schema/user.schema';
import { GetUser } from 'src/utils/get-user.decorator';
import { JwtAuthGuard } from 'src/utils/guards/jwt-guards';
import { CreateMessageContentDto, CreateMessageDto } from './dto/message.dto';
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
    @Res() res: Response,
    @GetUser() user: UserDocument,
    @Param() id: string
  ) {
    const result = await this.messageService.deleteMessageContainer(id, user._id);
    if (result) {
      res.status(HttpStatus.OK).json({ status: true });
    } else {
      throw new InternalServerErrorException();
    }
  }

  @Get(':idMessage/content')
  @ApiParam({ name: 'idMessage' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'size', required: false })
  async getMessageContent(
    @Res() res: Response,
    @GetUser() user: UserDocument,
    @Param('idMessage') idMessage: string,
    @Query('page') page: number = 1,
    @Query('size') size: number = 10,
  ) {
    const hostId = user._id;
    const result = await this.messageService.getMessageContent(idMessage, hostId, page, size);
    if (result) {
      res.status(HttpStatus.OK).json(result);
    } else {
      throw new InternalServerErrorException();
    }
  }

  @Post(':idMessage/content')
  @ApiParam({ name: 'idMessage' })
  async sendMessageContent(
    @GetUser() user: UserDocument,
    @Param('idMessage') idMessage: string,
    @Body() dto: CreateMessageContentDto
  ) {
    const container = await this.messageService.getMessageContainerById(idMessage);

    if (
      !container ||
      !Object.values(MessageType).filter(v => Number(v)).includes(dto.type)
    ) {
      return new InternalServerErrorException();
    }

    if (
      container.userA?.toString() !== user._id?.toString() &&
      container.userB?.toString() !== user._id?.toString()
    ) {
      return new ForbiddenException();
    }

    const fromId = user._id;
    const toId = container.userA?.toString() === fromId?.toString() ? container.userB : container.userA;
    const result = await this.messageService.insertMessageContent(idMessage, fromId, toId, dto);

    if (!result?.length) {
      return new InternalServerErrorException();
    }

    // socket emit
  }

  @Delete('content/:id')
  @ApiParam({ name: 'id' })
  async deleteMessageContent(
    @Res() res: Response,
    @GetUser() user: UserDocument,
    @Param() id: string
  ) {
    const result = await this.messageService.deleteMessageContent(id, user._id);
    if (result) {
      res.status(HttpStatus.OK).json({ status: true });
    } else {
      throw new InternalServerErrorException();
    }
  }
}
