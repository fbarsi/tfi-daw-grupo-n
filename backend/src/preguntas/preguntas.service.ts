import { Injectable } from '@nestjs/common';
import { CreatePreguntasDto } from './dto/create-preguntas.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Preguntas } from './entities/preguntas.entity';
import { EntityManager, Repository } from 'typeorm';
import { OpcionesService } from 'src/opciones/opciones.service';
import { Encuestas } from 'src/encuestas/entities/encuestas.entity';

@Injectable()
export class PreguntasService {
  constructor(
    private readonly opcionesService: OpcionesService,

    @InjectRepository(Preguntas)
    private readonly preguntasRepository: Repository<Preguntas>
  ) {}

  async crearPreguntas(manager: EntityManager, preguntaDto: CreatePreguntasDto, encuesta: Encuestas): Promise<void> {
    const pregunta = manager.create(Preguntas, {
      numero: preguntaDto.numero,
      texto: preguntaDto.texto,
      tipo: preguntaDto.tipo,
      encuesta
    });
    await manager.save(pregunta);
    
    if (preguntaDto.opciones) {
      await this.opcionesService.crearOpciones(manager, preguntaDto.opciones, pregunta);
    }
  }

  async findAll(): Promise<Preguntas[]> {
    return await this.preguntasRepository.find();
  }

  async findOne(id: number): Promise<Preguntas | null> {
    return await this.preguntasRepository.findOne({ where: { id }, relations: ['opciones'] });
  }
}
