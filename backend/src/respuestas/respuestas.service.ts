import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';

import { CreateRespuestasDto, PreguntaRespuestaDto } from './dto/create-respuestas.dto';
import { Encuestas } from 'src/encuestas/entities/encuestas.entity';
import { Respuestas } from './entities/respuestas.entity';
import { Preguntas } from 'src/preguntas/entities/preguntas.entity';
import { RespuestasAbiertasService } from 'src/respuestas-abiertas/respuestas-abiertas.service';
import { RespuestasOpcionesService } from 'src/respuestas-opciones/respuestas-opciones.service';

@Injectable()
export class RespuestasService {
  constructor(
    private readonly respuestasAbiertasService: RespuestasAbiertasService,
    private readonly respuestasOpcionesService: RespuestasOpcionesService,
    @InjectEntityManager()
    private readonly manager: EntityManager,
  ) {}

  async create(dto: CreateRespuestasDto) {
    return this.manager.transaction(async (m) => {
      const encuesta = await m.findOne(Encuestas, { where: { id: dto.encuestaId } });
      if (!encuesta) throw new BadRequestException('Encuesta no encontrada');

      const respuesta = m.create(Respuestas, {
        encuesta,
        codigoRespuesta: dto.codigo_respuesta,
      });
      await m.save(respuesta);

      for (const preguntaDto of dto.preguntas as PreguntaRespuestaDto[]) {
        const pregunta = await m.findOne(Preguntas, {
          where: { numero: preguntaDto.preguntaId, encuesta: { id: encuesta.id } }
        });
        if (!pregunta) continue;

        await this.procesarTipoDePregunta(m, preguntaDto, pregunta, respuesta);
      }

      return respuesta;
    });
  }

  private async procesarTipoDePregunta(
    m: EntityManager,
    preguntaDto: PreguntaRespuestaDto,
    pregunta: Preguntas,
    respuesta: Respuestas,
  ) {
    switch (pregunta.tipo) {
      case 'abierta':
        if (preguntaDto.textoLibre) {
          await this.respuestasAbiertasService.crearRespuestaAbierta(
            m,
            preguntaDto.textoLibre,
            pregunta,
            respuesta
          );
        }
        break;

      case 'opcion_multiple_seleccion_multiple':
        if (preguntaDto.seleccionMultiple) {
          const ids = preguntaDto.seleccionMultiple.map(s => Number(s));
          await this.respuestasOpcionesService.crearRespuestasOpciones(
            m,
            ids,
            pregunta,
            respuesta
          );
        }
        break;

      case 'opcion_multiple_seleccion_simple':
        if (preguntaDto.seleccionSimple) {
          const id = Number(preguntaDto.seleccionSimple);
          await this.respuestasOpcionesService.crearRespuestasOpciones(
            m,
            [id],
            pregunta,
            respuesta
          );
        }
        break;
    }
  }

  
  async test(test) {
    console.log(test)
  }

  async findAll() {
  }

  async findOne(id: number) {
  }
}

