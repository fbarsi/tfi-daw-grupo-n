import { Injectable } from '@nestjs/common';
import { CreateRespuestasDto, PreguntasDto } from './dto/create-respuestas.dto';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { Respuestas } from './entities/respuestas.entity';
import { EntityManager, Repository } from 'typeorm';
import { Encuestas } from 'src/encuestas/entities/encuestas.entity';
import { Preguntas } from 'src/preguntas/entities/preguntas.entity';
import { RespuestasAbiertas } from 'src/respuestas-abiertas/entities/respuestas-abiertas.entity';
import { RespuestasOpciones } from 'src/respuestas-opciones/entities/respuestas-opciones.entity';
import { Opciones } from 'src/opciones/entities/opciones.entity';
import { RespuestasAbiertasService } from 'src/respuestas-abiertas/respuestas-abiertas.service';
import { RespuestasOpcionesService } from 'src/respuestas-opciones/respuestas-opciones.service';

@Injectable()
export class RespuestasService {
  constructor(
    private readonly respuestasAbiertasService: RespuestasAbiertasService,
    private readonly respuestasOpcionesService: RespuestasOpcionesService,

    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {}

  async create(createRespuestasDto: CreateRespuestasDto) {
    return this.entityManager.transaction(async (manager) => {
      // obtener el id de la encuesta por el codigo de respuesta
      const encuesta = await manager.findOne(Encuestas, {
        where: { codigo_respuesta: createRespuestasDto.codigo_respuesta },
      });
      if (!encuesta) {
        throw new Error('La encuesta no existe');
      }

      // instanciar la respuesta
      const respuesta = manager.create(Respuestas, { encuesta }); 
      await manager.save(respuesta);

      await this.procesarPreguntas(manager, createRespuestasDto, encuesta, respuesta);
    });
  }

  async procesarPreguntas(
    manager: EntityManager,
    createRespuestasDto: CreateRespuestasDto,
    encuesta: Encuestas,
    respuesta: Respuestas,
  ) {
    // iterar las preguntas respondidas
    for (const preguntaDto of createRespuestasDto.preguntas) {
      // obtener el id de la pregunta por el id de la encuesta y el numero de pregunta
      const pregunta = await manager.findOne(Preguntas, {
        where: { numero: preguntaDto.numero, encuesta: { id: encuesta.id } },
      });

      if (!pregunta) continue;

      // clasificar por respuesta abierta o por opciones basado en el tipo de pregunta
      await this.procesarTipoDePregunta(manager, preguntaDto, pregunta, respuesta);
    }
  }

  async procesarTipoDePregunta(
    manager: EntityManager,
    preguntaDto: PreguntasDto,
    pregunta: Preguntas,
    respuesta: Respuestas,
  ) {
    switch (pregunta.tipo) {
      case 'abierta':
        if (preguntaDto.texto) {
          await this.respuestasAbiertasService.crearRespuestaAbierta(
            manager,
            preguntaDto.texto,
            pregunta,
            respuesta
          );
        }
        break;

      case 'opcion_multiple_seleccion_simple':
      case 'opcion_multiple_seleccion_multiple':
        if (preguntaDto.opcionesNro) {
          await this.respuestasOpcionesService.crearRespuestasOpciones(
            manager,
            preguntaDto.opcionesNro,
            pregunta,
            respuesta
          );
        }
        break;
    }
  }

  async findAll() {
    // return await this.respuestasRepository.find();
  }

  async findOne(id: number) {
    // return await this.respuestasRepository.findOne({ where: { id } });
  }
}
