import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class RespuestasOpciones {
    @PrimaryGeneratedColumn()
    id:number

    @Column({type:'int', nullable: false})
    id_respuesta: number

    @Column({type:'int', nullable: false})
    id_opcion: number
}
