import { Controller, Get, Post, Body, Patch, Param, Delete, Response, Query, BadRequestException } from '@nestjs/common';
import { EncuestasService } from './encuestas.service';
import { CreateEncuestasDto } from './dto/create-encuestas.dto';

@Controller('encuestas')
export class EncuestasController {
  constructor(
    private readonly encuestasService: EncuestasService
  ) {}

  @Post()
  create(@Body() createEncuestasDto: CreateEncuestasDto) {
    return this.encuestasService.create(createEncuestasDto);
  }

  @Get()
  findAll() {
    return this.encuestasService.findAll();
  }

  @Get(':codigo_respuesta')
  obtenerPreguntas(@Param('codigo_respuesta') codigo_respuesta: string) {
    return this.encuestasService.obtenerPreguntas(codigo_respuesta);
  }

  @Get('respuestas/:codigo_resultados')
  async obtenerRespuestasDeEncuesta(
    @Param('codigo_resultados') codigo_resultados: string,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '5'
  ) {
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);

    if (isNaN(pageNum) || pageNum <= 0 || isNaN(limitNum) || limitNum <= 0) {
      throw new BadRequestException('Los parámetros de paginación "page" y "limit" deben ser números positivos.');
    }

    return this.encuestasService.obtenerRespuestasDeEncuesta(codigo_resultados, pageNum, limitNum);
  }

  @Get('estadisticas/:codigo_resultados')
  obtenerEstadisticas(@Param('codigo_resultados') codigo_resultados: string) {
    return this.encuestasService.obtenerEstadisticas(codigo_resultados);
  }

  @Get('estadisticas/csv/:codigo_resultados')
    async exportEstadisticasToCsv(
    @Param('codigo_resultados') codigo_resultados: string,
    @Response() res,
    ) {
    const csv = await this.encuestasService.exportarEstadisticasCsv(codigo_resultados);
    res.header('Content-Type', 'text/csv');
    res.attachment(`estadisticas_${codigo_resultados}.csv`);
    res.send(csv);
  }
}
