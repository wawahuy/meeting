import { Controller, Get, Query, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { JwtAuthGuard } from 'src/utils/guards/jwt-guards';

@ApiTags('message')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('message')
export class MessageController {

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
    
  }
}
