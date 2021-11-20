import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  private id = 1;

  getHello(): string {
    return 'Hello World!' + (this.id++);
  }
}
