import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TiposRespuesta } from '../dto/create-preguntas.dto';
import { Encuestas } from 'src/encuestas/entities/encuestas.entity';
import { Opciones } from 'src/opciones/entities/opciones.entity';

@Entity()
export class Preguntas {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', nullable: false })
  numero: number;

  @Column({ type: 'varchar', length: '255', nullable: false })
  texto: string;

  @Column({
    type: 'enum',
    enum: TiposRespuesta,
    enumName: 'tipos_respuesta',
    nullable: false,
  })
  tipo: TiposRespuesta;

  @ManyToOne(() => Encuestas, (encuesta) => encuesta.preguntas)
  @JoinColumn({ name: 'id_encuesta' })
  encuesta: Encuestas;

  @OneToMany(() => Opciones, (opcion) => opcion.pregunta)
  opciones: Opciones[];
}
