import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class RespuestasAbiertas {
    @PrimaryGeneratedColumn()
    id: number

    @Column({type:'varchar', length:'255', nullable: false})
    texto: string

    @Column({type:'int', nullable: false})
    id_pregunta: number

    @Column({type:'int', nullable: false})
    id_respuesta: number
}
