import { Preguntas } from 'src/preguntas/entities/preguntas.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Opciones {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', nullable: false })
  numero: number;

  @Column({ type: 'varchar', length: '255', nullable: false })
  texto: string;

  @ManyToOne(() => Preguntas, (pregunta) => pregunta.opciones)
  @JoinColumn({ name: 'id_pregunta' })
  pregunta: Preguntas;
}
