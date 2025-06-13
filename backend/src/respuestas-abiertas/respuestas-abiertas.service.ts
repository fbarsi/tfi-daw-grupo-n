import { Injectable } from '@nestjs/common';
import { CreateRespuestasAbiertasDto } from './dto/create-respuestas-abiertas.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { RespuestasAbiertas } from './entities/respuestas-abiertas.entity';
import { EntityManager, Repository } from 'typeorm';
import { Preguntas } from 'src/preguntas/entities/preguntas.entity';
import { Respuestas } from 'src/respuestas/entities/respuestas.entity';

@Injectable()
export class RespuestasAbiertasService {
  constructor(
  ) {}

  async crearRespuestaAbierta(
    manager: EntityManager,
    texto: string,
    pregunta: Preguntas,
    respuesta: Respuestas
  ) {
    const respuestaAbierta = manager.create(RespuestasAbiertas, {
      texto,
      pregunta,
      respuesta,
    });
    return await manager.save(respuestaAbierta);
  }
}
