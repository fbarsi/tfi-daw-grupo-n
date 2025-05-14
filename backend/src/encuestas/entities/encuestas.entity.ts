import { Preguntas } from 'src/preguntas/entities/preguntas.entity';
import { Respuestas } from 'src/respuestas/entities/respuestas.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Encuestas {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: '255', nullable: false })
  nombre: string;

  @Column({
    type: 'uuid',
    nullable: false,
    unique: true,
    default: () => 'gen_random_uuid()',
  })
  codigo_respuesta: string;

  @Column({
    type: 'uuid',
    nullable: false,
    unique: true,
    default: () => 'gen_random_uuid()',
  })
  codigo_resultados: string;

  @OneToMany(() => Preguntas, (pregunta) => pregunta.encuesta)
  preguntas: Preguntas[];

  @OneToMany(() => Respuestas, (respuesta) => respuesta.encuesta)
  respuestas: Respuestas[];
}
