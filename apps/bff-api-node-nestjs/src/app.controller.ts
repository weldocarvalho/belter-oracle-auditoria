// src/app.controller.ts
import { Controller, Get } from '@nestjs/common';

@Controller('health') // http://localhost:3333/health
export class AppController {
  // REMOVEMOS O CONSTRUTOR QUE PEDIA O APPSERVICE
  
  @Get()
  getHealth() {
    return { 
      status: 'OK', 
      message: 'API NestJS do Micro SaaS de Pele ativa!' 
    };
  }
}
