import { Preguntas } from 'src/preguntas/entities/preguntas.entity';
import { Respuestas } from 'src/respuestas/entities/respuestas.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class RespuestasAbiertas {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: '255', nullable: false })
  texto: string;
    
  @ManyToOne(() => Preguntas, (pregunta) => pregunta.respuestas_abiertas)
  @JoinColumn({ name: 'id_pregunta' })
  pregunta: Preguntas;

  @ManyToOne(() => Respuestas, (respuesta) => respuesta.respuestas_abiertas)
  @JoinColumn({ name: 'id_respuesta' })
  respuesta: Respuestas;
}
