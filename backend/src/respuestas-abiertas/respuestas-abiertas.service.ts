import { Injectable } from '@nestjs/common';
import { CreateRespuestasAbiertasDto } from './dto/create-respuestas-abiertas.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { RespuestasAbiertas } from './entities/respuestas-abiertas.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RespuestasAbiertasService {
  constructor(
    @InjectRepository(RespuestasAbiertas)
    private readonly respuestasAbiertasRepository: Repository<RespuestasAbiertas>
  ) {}
  async create(createRespuestasAbiertasDto: CreateRespuestasAbiertasDto): Promise<RespuestasAbiertas> {
    const nuevaRespuestaAbierta = this.respuestasAbiertasRepository.create(createRespuestasAbiertasDto)
    return await this.respuestasAbiertasRepository.save(nuevaRespuestaAbierta);
  }

  async findAll(): Promise<RespuestasAbiertas[]> {
    return await this.respuestasAbiertasRepository.find();
  }

  async findOne(id: number): Promise<RespuestasAbiertas | null> {
    return await this.respuestasAbiertasRepository.findOne({ where: { id } });
  }
}
