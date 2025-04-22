import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello() {
    return { data: 'Hello Man! Thanks for being with Expertsquad 🌹' };
  }
}
