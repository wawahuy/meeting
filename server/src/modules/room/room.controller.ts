import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Controller, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/utils/guards/jwt-guards';

@ApiTags('room')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('room')
export class RoomController {
  
}
