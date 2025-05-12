import { Injectable } from '@nestjs/common';
import { CreatePreguntasDto } from './dto/create-preguntas.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Preguntas } from './entities/preguntas.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PreguntasService {
  constructor(
    @InjectRepository(Preguntas)
    private readonly preguntasRepository: Repository<Preguntas>
  ) {}

  async create(createPreguntasDto: CreatePreguntasDto): Promise<Preguntas> {
    const nuevaPregunta = this.preguntasRepository.create(createPreguntasDto);
    return await this.preguntasRepository.save(nuevaPregunta);
  }

  async findAll(): Promise<Preguntas[]> {
    return await this.preguntasRepository.find();
  }

  async findOne(id: number): Promise<Preguntas | null> {
    return await this.preguntasRepository.findOne({ where: { id } });
  }
}
