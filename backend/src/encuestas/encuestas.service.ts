import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateEncuestasDto } from './dto/create-encuestas.dto';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { Encuestas } from './entities/encuestas.entity';
import { Brackets, EntityManager, Repository } from 'typeorm';
import { Preguntas } from 'src/preguntas/entities/preguntas.entity';
import { Opciones } from 'src/opciones/entities/opciones.entity';
import { PreguntasService } from 'src/preguntas/preguntas.service';
import { Respuestas } from 'src/respuestas/entities/respuestas.entity';
import { resolve } from 'path';
import { Parser } from '@json2csv/plainjs';

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
        nombre: encuestaDto.nombre,
        fechaVencimiento: encuestaDto.fechaVencimiento
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

  async obtenerPreguntas(codigo_respuesta: string): Promise<Encuestas | null> {
    const encuesta = await this.encuestasRepository
      .createQueryBuilder('encuesta')
      .leftJoinAndSelect('encuesta.preguntas', 'pregunta')
      .leftJoinAndSelect('pregunta.opciones', 'opcion')
      .select([
        'encuesta.nombre',
        'encuesta.fechaVencimiento',
        'pregunta.numero',
        'pregunta.tipo',
        'pregunta.texto',
        'opcion.numero',
        'opcion.texto'
      ])
      .where('encuesta.codigo_respuesta = :codigo_respuesta', {codigo_respuesta})
      .orderBy('pregunta.numero', 'ASC')
      .getOne()
    
    if (!encuesta) {
      throw new BadRequestException('Encuesta no encontrada')
    }

    if (encuesta.fechaVencimiento && new Date() > new Date(encuesta.fechaVencimiento)) {
      throw new BadRequestException('La encuesta ya ha vencido');
    }

    return encuesta
  }

  async obtenerEstadisticas(codigo_resultados: string) {
    const encuesta = await this.encuestasRepository
    .createQueryBuilder('encuesta')
    .leftJoinAndSelect('encuesta.preguntas','pregunta')
    .leftJoinAndSelect('pregunta.respuestas_abiertas','respuestas_abiertas')
    .leftJoinAndSelect('pregunta.opciones','opcion')
    .loadRelationCountAndMap('opcion.totalRespuestas', 'opcion.respuestas_opciones')
    .where('encuesta.codigo_resultados = :codigo', { codigo: codigo_resultados })
    .orderBy('pregunta.numero', 'ASC')
    .select([
      'encuesta.nombre',
      'pregunta.numero',
      'pregunta.texto',
      'pregunta.tipo',
      'opcion.numero',
      'opcion.texto',
      'respuestas_abiertas.texto'
    ])
    .getOne()

    if (!encuesta) {
      throw new BadRequestException('Encuesta no encontrada')
    }

    return encuesta
  }

  async exportarEstadisticasCsv(codigo_resultados: string): Promise<string> {
  const estadisticas = await this.obtenerEstadisticas(codigo_resultados);
  const datosParaCsv: Record<string, any>[] = [];
  for (const pregunta of estadisticas.preguntas) {
    for (const opcion of pregunta.opciones) {
      const fila = {
        pregunta_texto: pregunta.texto,
        opcion_texto: opcion.texto,
        veces_seleccionada: opcion.totalRespuestas
      };
      datosParaCsv.push(fila);
    }
  }
  const camposCsv = [
    { label: 'Pregunta', value: 'pregunta_texto' },
    { label: 'Opción', value: 'opcion_texto' },
    { label: 'Selecciones', value: 'veces_seleccionada' },
  ];

  const parser = new Parser({ fields: camposCsv });
  return parser.parse(datosParaCsv);
}

}

