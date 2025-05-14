import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { RespuestasService } from './respuestas.service';
import { CreateRespuestasDto } from './dto/create-respuestas.dto';

@Controller('respuestas')
export class RespuestasController {
  constructor(private readonly respuestasService: RespuestasService) {}

  @Post(':codigo')
  create(
    @Query() codigo: string,
    @Body() createRespuestasDto: CreateRespuestasDto,
  ) {
    return this.respuestasService.create(codigo, createRespuestasDto);
  }

  @Get()
  findAll() {
    return this.respuestasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.respuestasService.findOne(+id);
  }
}
