import { Injectable } from '@nestjs/common';
import { CreateRespuestasOpcionesDto } from './dto/create-respuestas-opciones.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { RespuestasOpciones } from './entities/respuestas-opciones.entity';
import { EntityManager, Repository } from 'typeorm';
import { Preguntas } from 'src/preguntas/entities/preguntas.entity';
import { Respuestas } from 'src/respuestas/entities/respuestas.entity';
import { Opciones } from 'src/opciones/entities/opciones.entity';

@Injectable()
export class RespuestasOpcionesService {
  constructor(
    // @InjectRepository(RespuestasOpciones)
    // private readonly respuestasOpcionesRepository: Repository<RespuestasOpciones>
  ) {}

  async crearRespuestasOpciones(
      manager: EntityManager,
      numerosOpciones: number[],
      pregunta: Preguntas,
      respuesta: Respuestas
    ) {
      for (const numeroOpcion of numerosOpciones) {
        const opcion = await manager.findOne(Opciones, {
          where: { numero: numeroOpcion, pregunta: { id: pregunta.id } },
        });
        if (opcion) {
          const respuesta_opcion = manager.create(RespuestasOpciones, { respuesta, opcion })
          await manager.save(respuesta_opcion);
        }
    }
    }

  // async findAll(): Promise<RespuestasOpciones[]> {
  //   return await this.respuestasOpcionesRepository.find();
  // }

  // async findOne(id: number): Promise<RespuestasOpciones | null> {
  //   return await this.respuestasOpcionesRepository.findOne({ where: { id } });
  // }
}
