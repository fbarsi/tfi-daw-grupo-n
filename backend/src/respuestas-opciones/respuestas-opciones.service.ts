import { Injectable } from '@nestjs/common';
import { CreateRespuestasOpcionesDto } from './dto/create-respuestas-opciones.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { RespuestasOpciones } from './entities/respuestas-opciones.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RespuestasOpcionesService {
  constructor(
    @InjectRepository(RespuestasOpciones)
    private readonly respuestasOpcionesRepository: Repository<RespuestasOpciones>
  ) {}

  async create(createRespuestasOpcionesDto: CreateRespuestasOpcionesDto): Promise<RespuestasOpciones> {
    const nuevaRespuestasOpciones = this.respuestasOpcionesRepository.create(createRespuestasOpcionesDto)
    return await this.respuestasOpcionesRepository.save(nuevaRespuestasOpciones);
  }

  async findAll(): Promise<RespuestasOpciones[]> {
    return await this.respuestasOpcionesRepository.find();
  }

  async findOne(id: number): Promise<RespuestasOpciones | null> {
    return await this.respuestasOpcionesRepository.findOne({ where: { id } });
  }
}
