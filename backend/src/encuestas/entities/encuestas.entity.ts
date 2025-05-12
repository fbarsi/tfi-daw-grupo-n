import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Encuestas {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: '255', nullable: false })
  nombre: string;

  @Column({ type: 'varchar', length: '255', nullable: false })
  codigo_respuesta: string;

  @Column({ type: 'varchar', length: '255', nullable: false })
  codigo_resultados: string;
}
