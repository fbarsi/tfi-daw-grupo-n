import { Injectable } from '@nestjs/common';
import { CreateRespuestasDto } from './dto/create-respuestas.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Respuestas } from './entities/respuestas.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RespuestasService {
  constructor(
    @InjectRepository(Respuestas)
    private readonly respuestasRepository: Repository<Respuestas>
  ) {}

  async create(createRespuestasDto: CreateRespuestasDto): Promise<Respuestas> {
    const nuevaRespuesta = this.respuestasRepository.create(createRespuestasDto);

    return await this.respuestasRepository.save(nuevaRespuesta);
  }

  async findAll(): Promise<Respuestas[]> {
    return await this.respuestasRepository.find();
  }

  async findOne(id: number): Promise<Respuestas | null> {
    return await this.respuestasRepository.findOne({ where: { id } });
  }
}
