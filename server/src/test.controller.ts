import { Controller, Get, Param, Redirect } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('/test')
export class TestController {
  constructor(private readonly appService: AppService) {}

  @Get(':id')
  getHello(@Param('id') id): string {
    return this.appService.getHello() + ' ' + id;
  }
}
