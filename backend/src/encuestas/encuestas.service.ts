import { Injectable } from '@nestjs/common';
import { CreateEncuestasDto } from './dto/create-encuestas.dto';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { Encuestas } from './entities/encuestas.entity';
import { EntityManager, Repository } from 'typeorm';
import { Preguntas } from 'src/preguntas/entities/preguntas.entity';
import { Opciones } from 'src/opciones/entities/opciones.entity';
import { PreguntasService } from 'src/preguntas/preguntas.service';

@Injectable()
export class EncuestasService {
  constructor(
    private readonly preguntasService: PreguntasService,

    @InjectRepository(Encuestas)
    private readonly encuestasRepository: Repository<Encuestas>,

    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {}

  async create(encuestaDto: CreateEncuestasDto) {
    return this.entityManager.transaction(async (manager) => {
      const encuesta = manager.create(Encuestas, {
        nombre: encuestaDto.nombre
      });
      await manager.save(encuesta);
      
      for (const preguntaDto of encuestaDto.preguntas) {
        await this.preguntasService.crearPreguntas(manager, preguntaDto, encuesta)
      }

      return {
        codigo_respuesta: encuesta.codigo_respuesta, 
        codigo_resultados: encuesta.codigo_resultados};
    });
  }

  async findAll(): Promise<Encuestas[]> {
    return await this.encuestasRepository.find();
  }

  async findOne(id: number): Promise<Encuestas | null> { 
    return await this.encuestasRepository.findOne({ 
      where: { id },
      select: { 
        nombre: true,
        codigo_respuesta: true,
        codigo_resultados: true
      }
    });
  }

  async findQuestions(codigo_respuesta: string): Promise<Encuestas | null> {
    return await this.encuestasRepository
      .createQueryBuilder('encuesta')
      .leftJoinAndSelect('encuesta.preguntas', 'pregunta')
      .leftJoinAndSelect('pregunta.opciones', 'opcion')
      .select([
        'encuesta.nombre',
        'pregunta.numero',
        'pregunta.tipo',
        'pregunta.texto',
        'opcion.numero',
        'opcion.texto'
      ])
      .where('encuesta.codigo_respuesta = :codigo_respuesta', {codigo_respuesta})
      .getOne()
  }
}

