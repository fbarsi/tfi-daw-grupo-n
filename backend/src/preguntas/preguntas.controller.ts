import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PreguntasService } from './preguntas.service';
import { CreatePreguntasDto } from './dto/create-preguntas.dto';

@Controller('preguntas')
export class PreguntasController {
  constructor(private readonly preguntasService: PreguntasService) {}

  @Post()
  create(@Body() createPreguntasDto: CreatePreguntasDto) {
    return this.preguntasService.create(createPreguntasDto);
  }

  @Get()
  findAll() {
    return this.preguntasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.preguntasService.findOne(+id);
  }
}
