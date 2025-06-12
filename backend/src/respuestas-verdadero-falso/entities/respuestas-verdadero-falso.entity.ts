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
export class RespuestasVerdaderoFalso {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'boolean', nullable: false })
  opcion: boolean;
    
  @ManyToOne(() => Preguntas, (pregunta) => pregunta.respuestas_verdadero_falso)
  @JoinColumn({ name: 'id_pregunta' })
  pregunta: Preguntas;

  @ManyToOne(() => Respuestas, (respuesta) => respuesta.respuestas_verdadero_falso)
  @JoinColumn({ name: 'id_respuesta' })
  respuesta: Respuestas;
}
