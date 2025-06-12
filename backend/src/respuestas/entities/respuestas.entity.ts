import { Encuestas } from 'src/encuestas/entities/encuestas.entity';
import { RespuestasAbiertas } from 'src/respuestas-abiertas/entities/respuestas-abiertas.entity';
import { RespuestasOpciones } from 'src/respuestas-opciones/entities/respuestas-opciones.entity';
import { RespuestasVerdaderoFalso } from 'src/respuestas-verdadero-falso/entities/respuestas-verdadero-falso.entity';
import {
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Respuestas {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Encuestas, (encuesta) => encuesta.respuestas)
  @JoinColumn({ name: 'id_encuesta' })
  encuesta: Encuestas;

  @OneToMany(() => RespuestasAbiertas, (respuesta_abierta) => respuesta_abierta.respuesta)
  respuestas_abiertas: RespuestasAbiertas[];

  @OneToMany(() => RespuestasVerdaderoFalso, (respuesta_v_f) => respuesta_v_f.respuesta)
  respuestas_verdadero_falso: RespuestasVerdaderoFalso[];

  @OneToMany(() => RespuestasOpciones, (respuesta_opcion) => respuesta_opcion.respuesta)
  respuestas_opciones: RespuestasOpciones[];
}
