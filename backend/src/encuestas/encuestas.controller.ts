import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EncuestasService } from './encuestas.service';
import { CreateEncuestasDto } from './dto/create-encuestas.dto';
import { PreguntasService } from 'src/preguntas/preguntas.service';

@Controller('encuestas')
export class EncuestasController {
  constructor(
    private readonly encuestasService: EncuestasService,
    private readonly preguntasService: PreguntasService,
  ) {}

  @Post()
  create(@Body() createEncuestasDto: CreateEncuestasDto) {
    return this.encuestasService.create(createEncuestasDto);
  }

  @Get()
  findAll() {
    return this.encuestasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.encuestasService.findOne(+id);
  }

  @Get(':id/preguntas')
  findQuestions(@Param('id') id: string) {
    return this.encuestasService.findQuestions(+id);
  }
}
