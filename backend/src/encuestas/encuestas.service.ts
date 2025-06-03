import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEncuestasDto } from './dto/create-encuestas.dto';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { Encuestas } from './entities/encuestas.entity';
import { Brackets, EntityManager, Repository } from 'typeorm';
import { Preguntas } from 'src/preguntas/entities/preguntas.entity';
import { Opciones } from 'src/opciones/entities/opciones.entity';
import { PreguntasService } from 'src/preguntas/preguntas.service';
import { Respuestas } from 'src/respuestas/entities/respuestas.entity';
import { resolve } from 'path';

@Injectable()
export class EncuestasService {
  constructor(
    private readonly preguntasService: PreguntasService,

    @InjectRepository(Encuestas)
    private readonly encuestasRepository: Repository<Encuestas>,

    @InjectRepository(Preguntas)
    private readonly preguntasRepository: Repository<Preguntas>,

    @InjectRepository(Respuestas)
    private readonly respuestasRepository: Repository<Respuestas>,

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


  // EN DESARROLLO!! IGNORAR!!!!
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
      .orderBy('pregunta.numero', 'ASC')
      .getOne()
  }

  async obtenerEstadisticas(codigo_resultados: string) {
    const encuesta = await this.encuestasRepository.findOne({
      where: { codigo_resultados: codigo_resultados },
    });

    if (!encuesta) {
      throw new NotFoundException('Encuesta no encontrada');
    }

    const respuestas = await this.respuestasRepository.find({
      where: { encuesta: encuesta}
    })

    if (!respuestas) {
      throw new NotFoundException('Respuestas no encontradas');
    }
   
    const resultados = respuestas.map(async (respuesta) => {
      const preguntas = await this.preguntasRepository
        .createQueryBuilder('pregunta')
        .leftJoinAndSelect('pregunta.opciones', 'opcion')
        .leftJoinAndSelect('opcion.respuestas_opciones', 'ro')
        .leftJoinAndSelect('pregunta.respuestas_abiertas', 'ra')
        .select([
          'pregunta.numero',
          'opcion.numero',
          'ra.texto'
        ])
        .where('pregunta.id_encuesta = :id_encuesta', { id_encuesta: encuesta.id })
        .andWhere(new Brackets(qb => {
          qb.where('ro.id_respuesta = :id_respuesta', { id_respuesta: respuesta.id })
            .orWhere('ra.id_respuesta = :id_respuesta', { id_respuesta: respuesta.id });
        }))
        .orderBy('pregunta.numero', 'ASC')
        .addOrderBy('opcion.numero', 'ASC')
        .getMany();

      return preguntas
    });

    return Promise.all(resultados);
    
    // const todasLasPreguntas: Array<Preguntas[]> = [];

    // for (const respuesta of respuestas) {
    //   const preguntas = await this.preguntasRepository
    //     .createQueryBuilder('pregunta')
    //     .leftJoinAndSelect('pregunta.opciones', 'opcion')
    //     .leftJoinAndSelect('opcion.respuestas_opciones', 'ro')
    //     .leftJoinAndSelect('pregunta.respuestas_abiertas', 'ra')
    //     .select([
    //       'pregunta.numero',
    //       'opcion.numero',
    //       'ra.texto'
    //     ])
    //     .where('pregunta.id_encuesta = :id_encuesta', { id_encuesta: encuesta.id })
    //     .andWhere(new Brackets(qb => {
    //       qb.where('ro.id_respuesta = :id_respuesta', { id_respuesta: respuesta.id })
    //         .orWhere('ra.id_respuesta = :id_respuesta', { id_respuesta: respuesta.id });
    //     }))
    //     .orderBy('pregunta.numero', 'ASC')
    //     .addOrderBy('opcion.numero', 'ASC')
    //     .getMany();
      
    //   todasLasPreguntas.push(preguntas);
    // }
    // return todasLasPreguntas;
  }


  // async obtenerEstadisticas(codigo_resultados: string) {
  //   return await this.encuestasRepository
  //     .createQueryBuilder('encuesta')
  //     .leftJoinAndSelect('encuesta.preguntas', 'pregunta')
  //     .leftJoinAndSelect('pregunta.opciones', 'opcion')
  //     .leftJoinAndSelect('encuesta.respuestas', 'respuesta')
  //     .leftJoinAndSelect('respuesta.respuestas_abiertas', 'ra')
  //     .leftJoinAndSelect('respuesta.respuestas_opciones', 'ro')
  //     .leftJoinAndSelect('ra.pregunta', 'rapreg')
  //     .leftJoinAndSelect('ro.opcion', 'roo')
  //     .leftJoinAndSelect('roo.pregunta', 'roopreg')
  //     .select([
  //       'encuesta.nombre',
  //       'pregunta.numero',
  //       'pregunta.tipo',
  //       'pregunta.texto',
  //       'opcion.numero',
  //       'opcion.texto',
  //       'respuesta.id',
  //       'ra.texto',
  //       'rapreg.numero',
  //       'ro.id',
  //       'roo.numero',
  //       'roopreg.numero'
  //     ])
  //     .where('encuesta.codigo_resultados = :codigo_resultados', {codigo_resultados})
  //     .getOne()
  // }
}

