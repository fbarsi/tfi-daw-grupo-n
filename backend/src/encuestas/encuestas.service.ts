import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEncuestasDto } from './dto/create-encuestas.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Encuestas } from './entities/encuestas.entity';
import { Repository } from 'typeorm';

@Injectable()
export class EncuestasService {
  constructor(
    @InjectRepository(Encuestas)
    private readonly encuestasRepository: Repository<Encuestas>,
  ) {}

  async create(createEncuestasDto: CreateEncuestasDto): Promise<Encuestas> {
    const nuevaEncuesta = this.encuestasRepository.create(createEncuestasDto);

    return await this.encuestasRepository.save(nuevaEncuesta);
  }

  async findAll(): Promise<Encuestas[]> {
    return await this.encuestasRepository.find();
  }

  async findOne(id: number): Promise<Encuestas | null> {
    return await this.encuestasRepository.findOne({ where: { id } });
  }
}
