import { Preguntas } from "./preguntas";

export interface Encuesta {
    nombre:string;
    preguntas: Preguntas[];
    codigo_respuesta?:string;
    codigo_resultados?:string;
}
