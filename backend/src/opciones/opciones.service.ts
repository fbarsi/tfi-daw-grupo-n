import { Injectable } from '@nestjs/common';
import { CreateOpcionesDto } from './dto/create-opciones.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Opciones } from './entities/opciones.entity';
import { Repository } from 'typeorm';

@Injectable()
export class OpcionesService {
  constructor(
    @InjectRepository(Opciones)
    private readonly opcionesRepository: Repository<Opciones>
  ) {}

  async create(createOpcionesDto: CreateOpcionesDto): Promise<Opciones> {
    const nuevaOpcion = this.opcionesRepository.create(createOpcionesDto)
    return await this.opcionesRepository.save(nuevaOpcion);
  }

  async findAll(): Promise<Opciones[]> {
    return await this.opcionesRepository.find();
  }

  async findOne(id: number): Promise<Opciones | null> {
    return await this.opcionesRepository.findOne({ where: { id } });
  }
}
