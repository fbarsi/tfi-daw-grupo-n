

export interface Respuestas {
    codigo_respuesta : string,
    preguntas : [{
        numero : number,
        texto? : string,
        opcionesNro? : number[];
    }];

}
