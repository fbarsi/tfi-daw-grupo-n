import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { RespuestasService } from './respuestas.service';
import { CreateRespuestasDto } from './dto/create-respuestas.dto';

@Controller('respuestas')
export class RespuestasController {
  constructor(private readonly respuestasService: RespuestasService) {}

  @Post()
  create(@Body() createRespuestasDto: CreateRespuestasDto) {
    return this.respuestasService.create(createRespuestasDto);
  }

  @Post('test')
  test(@Body() test) {
    return this.respuestasService.test(test);
  }

  @Get()
  findAll() {
    return this.respuestasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.respuestasService.findOne(+id);
  }

const encuesta = await this.encuestasRepo.findOne(id);
if (encuesta.fechaVencimiento && new Date() > encuesta.fechaVencimiento) {
  throw new BadRequestException('La encuesta ya ha vencido');
}


}
