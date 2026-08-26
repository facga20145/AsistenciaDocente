import { Controller, Get, Post, Body } from '@nestjs/common';

@Controller('asistenciadocentes')
export class AsistenciadocentesController {
  constructor() {}

  @Get()
  findAll() {
    return [];
  }

  @Post()
  create(@Body() body: any) {
    return body;
  }
}
