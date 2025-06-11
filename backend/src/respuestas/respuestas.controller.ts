import {Controller, Get, Post, Body, Param, BadRequestException, ParseIntPipe} from '@nestjs/common';
import { RespuestasService } from './respuestas.service';
import { CreateRespuestasDto } from './dto/create-respuestas.dto';
import { EncuestasService } from '../encuestas/encuestas.service';
import { Encuestas } from '../encuestas/entities/encuestas.entity';

@Controller('respuestas')
export class RespuestasController {
  constructor(
    private readonly respuestasService: RespuestasService,
    private readonly encuestasService: EncuestasService,
  ) {}

  @Post()
  async create(@Body() dto: CreateRespuestasDto) {
    const encuestaId = dto.encuestaId;
    const encuesta: Encuestas | null = await this.encuestasService.findOne(encuestaId);
    if (!encuesta) {
      throw new BadRequestException(`Encuesta con ID ${encuestaId} no encontrada`);
    }


    if (encuesta.fechaVencimiento && new Date() > new Date(encuesta.fechaVencimiento)) {
      throw new BadRequestException('La encuesta ya ha vencido');
    }

    
    return this.respuestasService.create(dto);
  }

  @Get()
  findAll() {
    return this.respuestasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.respuestasService.findOne(id);
  }
}
