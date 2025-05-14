import { Opciones } from 'src/opciones/entities/opciones.entity';
import { Respuestas } from 'src/respuestas/entities/respuestas.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class RespuestasOpciones {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Opciones, (opcion) => opcion.respuestas_opciones)
  @JoinColumn({ name: 'id_opcion' })
  opcion: Opciones;

  @ManyToOne(() => Respuestas, (respuesta) => respuesta.respuestas_opciones)
  @JoinColumn({ name: 'id_respuesta' })
  respuesta: Respuestas;
}
