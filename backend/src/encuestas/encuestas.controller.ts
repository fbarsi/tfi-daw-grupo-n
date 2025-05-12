import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EncuestasService } from './encuestas.service';
import { CreateEncuestasDto } from './dto/create-encuestas.dto';

@Controller('encuestas')
export class EncuestasController {
  constructor(private readonly encuestasService: EncuestasService) {}

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
}
