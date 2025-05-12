import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { TiposRespuesta } from "../dto/create-preguntas.dto";

@Entity()
export class Preguntas {
    @PrimaryGeneratedColumn()
    id: number

    @Column({type:'int', nullable:false})
    numero: number

    @Column({type:'varchar', length:'255', nullable:false})
    texto: string

    @Column({type:'enum', enum:TiposRespuesta, enumName:'tipos_respuesta', nullable:false})
    tipo: TiposRespuesta

    @Column({type:'int', nullable:false})
    id_encuesta: number
}
