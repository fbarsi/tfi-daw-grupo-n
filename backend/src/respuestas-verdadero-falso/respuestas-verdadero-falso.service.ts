import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Preguntas } from 'src/preguntas/entities/preguntas.entity';
import { Respuestas } from 'src/respuestas/entities/respuestas.entity';
import { RespuestasVerdaderoFalso } from './entities/respuestas-verdadero-falso.entity';

@Injectable()
export class RespuestasVerdaderoFalsoService {
  constructor() {}

  async crearRespuestaVerdaderoFalso(
    manager: EntityManager,
    opcion: boolean,
    pregunta: Preguntas,
    respuesta: Respuestas
  ) {
    const respuestaVerdaderoFalso = manager.create(RespuestasVerdaderoFalso, {
      opcion,
      pregunta,
      respuesta,
    });
    return await manager.save(respuestaVerdaderoFalso);
  }
}
