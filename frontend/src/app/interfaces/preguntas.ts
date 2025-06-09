import { TiposRespuesta } from "./enum";
import { Opciones } from "./opciones";

export interface Preguntas {
    numero:number;
    texto:string;
    tipo: TiposRespuesta;
    opciones?: Opciones[];
}
