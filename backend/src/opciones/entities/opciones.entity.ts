import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Opciones {
    @PrimaryGeneratedColumn()
    id: number

    @Column({type:'varchar', length:'255', nullable: false})
    texto: string

    @Column({type:'int', nullable: false})
    numero: number

    @Column({type:'int', nullable: false})
    id_pregunta: number
}
