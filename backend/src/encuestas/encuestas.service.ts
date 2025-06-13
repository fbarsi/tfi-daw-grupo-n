import {
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import { CreateEncuestasDto } from './dto/create-encuestas.dto';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { Encuestas } from './entities/encuestas.entity';
import { EntityManager, Repository } from 'typeorm';
import { Preguntas } from 'src/preguntas/entities/preguntas.entity';
import { PreguntasService } from 'src/preguntas/preguntas.service';
import { Respuestas } from 'src/respuestas/entities/respuestas.entity';
import { Parser } from '@json2csv/plainjs';
import { RespuestasVerdaderoFalso } from 'src/respuestas-verdadero-falso/entities/respuestas-verdadero-falso.entity';

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

    @InjectRepository(RespuestasVerdaderoFalso)
    private readonly respuestasVerdaderoFalsoRepository: Repository<RespuestasVerdaderoFalso>,

    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {}

  async create(encuestaDto: CreateEncuestasDto) {
    return this.entityManager.transaction(async (manager) => {
      const encuesta = manager.create(Encuestas, {
        nombre: encuestaDto.nombre,
        fechaVencimiento: encuestaDto.fechaVencimiento,
      });
      await manager.save(encuesta);

      for (const preguntaDto of encuestaDto.preguntas) {
        await this.preguntasService.crearPreguntas(
          manager,
          preguntaDto,
          encuesta,
        );
      }

      return {
        codigo_respuesta: encuesta.codigo_respuesta,
        codigo_resultados: encuesta.codigo_resultados,
      };
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
        codigo_resultados: true,
      },
    });
  }

  async obtenerRespuestasDeEncuesta(
    codigo_resultados: string,
    page: number = 1,
    limit: number = 5
  ): Promise<{ data: any[]; total: number; page: number; last_page: number }> {
    // obtener la encuesta con sus respuestas
    const encuesta = await this.encuestasRepository.findOne({
      where: { codigo_resultados },
      relations: ['respuestas']
    });

    if (!encuesta) {
      throw new BadRequestException('Encuesta no encontrada');
    }

    const skip = (page - 1) * limit;

    // obtener las respuestas con sus relaciones y paginación
    const [respuestas, total] = await this.respuestasRepository.findAndCount({
      where: { encuesta: { id: encuesta.id } },
      relations: [
        'respuestas_abiertas',
        'respuestas_abiertas.pregunta',
        'respuestas_opciones',
        'respuestas_opciones.opcion',
        'respuestas_opciones.opcion.pregunta',
        'respuestas_verdadero_falso',
        'respuestas_verdadero_falso.pregunta'
      ],
      order: { id: 'ASC' },
      skip: skip,
      take: limit,
    });

    // formatear las respuestas según el tipo
    const formattedResponses = respuestas.map(respuesta => {
      const respuestasPorPregunta: Record<number, any> = {};

      // procesar respuestas abiertas
      respuesta.respuestas_abiertas?.forEach(ra => {
        respuestasPorPregunta[ra.pregunta.id] = {
          numero: ra.pregunta.numero,
          respuesta: ra.texto
        };
      });

      // procesar respuestas de opciones
      respuesta.respuestas_opciones?.forEach(ro => {
        const pregunta = ro.opcion.pregunta;
        if (pregunta.tipo === 'opcion_multiple_seleccion_simple') {
          respuestasPorPregunta[pregunta.id] = {
            numero: pregunta.numero,
            respuesta: ro.opcion.numero
          };
        } else if (pregunta.tipo === 'opcion_multiple_seleccion_multiple') {
          if (!respuestasPorPregunta[pregunta.id]) {
            respuestasPorPregunta[pregunta.id] = {
              numero: pregunta.numero,
              respuesta: []
            };
          }
          respuestasPorPregunta[pregunta.id].respuesta.push(ro.opcion.numero);
        }
      });

      // procesar respuestas verdadero/falso
      respuesta.respuestas_verdadero_falso?.forEach(rvf => {
        respuestasPorPregunta[rvf.pregunta.id] = {
          numero: rvf.pregunta.numero,
          respuesta: rvf.opcion
        };
      });

      return {
        preguntas: Object.values(respuestasPorPregunta).sort((a, b) => a.numero - b.numero)
      };
    });

    const last_page = Math.ceil(total / limit);

    return {
      data: formattedResponses,
      total: total,
      page: page,
      last_page: last_page
    };
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
        'opcion.texto',
      ])
      .where('encuesta.codigo_respuesta = :codigo_respuesta', {
        codigo_respuesta,
      })
      .orderBy('pregunta.numero', 'ASC')
      .getOne();

    if (!encuesta) {
      throw new BadRequestException('Encuesta no encontrada');
    }

    if (
      encuesta.fechaVencimiento &&
      new Date() > new Date(encuesta.fechaVencimiento)
    ) {
      throw new BadRequestException('La encuesta ya ha vencido');
    }

    return encuesta;
  }

  async obtenerEstadisticas(codigo_resultados: string) {
    const encuesta = await this.encuestasRepository
      .createQueryBuilder('encuesta')
      .leftJoinAndSelect('encuesta.preguntas', 'pregunta')
      .leftJoinAndSelect('pregunta.respuestas_abiertas', 'respuestas_abiertas')
      .leftJoinAndSelect('pregunta.respuestas_verdadero_falso', 'respuestas_verdadero_falso')
      .leftJoinAndSelect('pregunta.opciones', 'opcion')
      .loadRelationCountAndMap(
        'opcion.totalRespuestas',
        'opcion.respuestas_opciones',
      )
      .where('encuesta.codigo_resultados = :codigo', {
        codigo: codigo_resultados,
      })
      .orderBy('pregunta.numero', 'ASC')
      .select([
        'encuesta.nombre',
        'pregunta.id',
        'pregunta.numero',
        'pregunta.texto',
        'pregunta.tipo',
        'opcion.numero',
        'opcion.texto',
        'respuestas_abiertas.texto'
      ])
      .getOne();

    if (encuesta && encuesta.preguntas) {
      for (const pregunta of encuesta.preguntas) {
        if (pregunta.tipo === 'verdadero_falso') { 
          console.log(pregunta.id)
          const conteoVerdaderoFalso = await this.respuestasVerdaderoFalsoRepository
            .createQueryBuilder('rvf')
            .select([
              'rvf.opcion',
              'COUNT(rvf.opcion) as total'
            ])
            .where('rvf.id_pregunta = :idPregunta', { idPregunta: pregunta.id })
            .groupBy('rvf.opcion')
            .getRawMany();
          pregunta.respuestasVFAgrupadas = {
            verdadero: conteoVerdaderoFalso.find(item => item.rvf_opcion === true)?.total || 0,
            falso: conteoVerdaderoFalso.find(item => item.rvf_opcion === false)?.total || 0
          };
        }
      }
    }

    if (!encuesta) {
      throw new BadRequestException('Encuesta no encontrada');
    }

    return encuesta;
  }

  async exportarEstadisticasCsv(codigo_resultados: string): Promise<string> {
    const estadisticas = await this.obtenerEstadisticas(codigo_resultados);
    const datosParaCsv: Record<string, any>[] = [];
    for (const pregunta of estadisticas.preguntas) {
      for (const opcion of pregunta.opciones) {
        const fila = {
          pregunta_texto: pregunta.texto,
          opcion_texto: opcion.texto,
          veces_seleccionada: opcion.totalRespuestas,
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


  //para el email
  async buscarEncuestaPorCodRes(codigo){
 const encuesta = await this.encuestasRepository.findOne({ where: { codigo_respuesta: codigo } });
 return encuesta?.nombre
  }
  
}
