import { Preguntas } from 'src/preguntas/entities/preguntas.entity';
import { RespuestasOpciones } from 'src/respuestas-opciones/entities/respuestas-opciones.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Opciones {
  [x: string]: any;
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', nullable: false })
  numero: number;

  @Column({ type: 'varchar', length: '255', nullable: false })
  texto: string;

  @ManyToOne(() => Preguntas, (pregunta) => pregunta.opciones)
  @JoinColumn({ name: 'id_pregunta' })
  pregunta: Preguntas;

  @OneToMany(() => RespuestasOpciones, (respuesta_opcion) => respuesta_opcion.opcion)
  respuestas_opciones: RespuestasOpciones[];
}
