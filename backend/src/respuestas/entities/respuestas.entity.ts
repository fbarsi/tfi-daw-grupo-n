import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Respuestas {
    @PrimaryGeneratedColumn()
    id:number

    @Column({type:'int', nullable:false})
    id_encuesta: number
}
