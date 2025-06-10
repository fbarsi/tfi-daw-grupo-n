import { Injectable } from '@nestjs/common';
import { CreateOpcionesDto } from './dto/create-opciones.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Opciones } from './entities/opciones.entity';
import { EntityManager, Repository } from 'typeorm';
import { CreatePreguntasDto } from 'src/preguntas/dto/create-preguntas.dto';
import { Preguntas } from 'src/preguntas/entities/preguntas.entity';

@Injectable()
export class OpcionesService {
  constructor(
    @InjectRepository(Opciones)
    private readonly opcionesRepository: Repository<Opciones>
  ) {}

  async crearOpciones(manager: EntityManager, opcionesDto: CreateOpcionesDto[], pregunta:Preguntas): Promise<void> {
    const opciones = opcionesDto.map(opcionDto => 
        manager.create(Opciones, { ...opcionDto, pregunta })
      );
      await manager.save(opciones);
  }

  async findAll(): Promise<Opciones[]> {
    return await this.opcionesRepository.find();
  }

  async findOne(id: number): Promise<Opciones | null> {
    return await this.opcionesRepository.findOne({ where: { id } });
  }
}
