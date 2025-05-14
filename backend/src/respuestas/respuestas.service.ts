import { Injectable } from '@nestjs/common';
import { CreateRespuestasDto } from './dto/create-respuestas.dto';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { Respuestas } from './entities/respuestas.entity';
import { EntityManager, Repository } from 'typeorm';
import { Encuestas } from 'src/encuestas/entities/encuestas.entity';
import { Preguntas } from 'src/preguntas/entities/preguntas.entity';
import { RespuestasAbiertas } from 'src/respuestas-abiertas/entities/respuestas-abiertas.entity';
import { RespuestasOpciones } from 'src/respuestas-opciones/entities/respuestas-opciones.entity';
import { Opciones } from 'src/opciones/entities/opciones.entity';

@Injectable()
export class RespuestasService {
  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {}

  async create(createRespuestasDto: CreateRespuestasDto) {
    return this.entityManager.transaction(async (manager) => {
      const encuesta = await manager.findOne(Encuestas, {     // obtener el id de la encuesta por el codigo de respuesta
        where: { codigo_respuesta: createRespuestasDto.codigo_respuesta },
      });
      if (!encuesta) {
        throw new Error('La encuesta no existe');
      }

      const respuesta = manager.create(Respuestas, { encuesta });     // instanciar la respuesta
      await manager.save(respuesta);

      for (const preguntaDto of createRespuestasDto.preguntas) {      // iterar las preguntas respondidas
        const pregunta = await manager.findOne(Preguntas, {     // obtener el id de la pregunta por el id de la encuesta y el numero de pregunta
          where: { numero: preguntaDto.numero, encuesta: { id: encuesta.id } },
        });

        if (!pregunta) continue

        // clasificar por respuesta abierta o por opciones basado en el tipo de pregunta
        if (pregunta.tipo == 'abierta' && preguntaDto.texto) {
          const respuesta_abierta = manager.create(RespuestasAbiertas, {      // instanciar la relacion respuesta_abierta
            texto: preguntaDto.texto,
            pregunta,
            respuesta,
          });
          await manager.save(respuesta_abierta);
        } 
        else if (
          (pregunta.tipo == 'opcion_multiple_seleccion_simple' ||
           pregunta.tipo == 'opcion_multiple_seleccion_multiple') && preguntaDto.opcionesNro
        ) {  
          for (const opcionDto of preguntaDto.opcionesNro) {
            const opcion = await manager.findOne(Opciones, {      // obtener el id de opcion basado en el id de pregunta y el numero de opcion
              where: { numero: opcionDto, pregunta: { id: pregunta.id } },
            });
            if (opcion) {
              const respuesta_opcion = manager.create(RespuestasOpciones, {     // instanciar la relacion respuesta_opciones
                respuesta,
                opcion,
              });
              await manager.save(respuesta_opcion);
            }
          }
        }
      }
    });
  }

  async findAll() {
    // return await this.respuestasRepository.find();
  }

  async findOne(id: number) {
    // return await this.respuestasRepository.findOne({ where: { id } });
  }
}
