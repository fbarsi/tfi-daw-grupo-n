export interface Opcion {
  numero: number;
  texto: string;
  totalRespuestas: number;
}

export interface RespuestaAbierta {
  texto: string;
}

export interface RespuestasVFAgrupadas {
  verdadero: number;
  falso: number;
}

export interface Pregunta {
  numero: number;
  texto: string;
  tipo: 'abierta' | 'opcion_multiple_seleccion_simple' | 'opcion_multiple_seleccion_multiple' | 'verdadero_falso';
  opciones?: Opcion[];
  respuestas_abiertas?: RespuestaAbierta[];
  respuestasVFAgrupadas?: RespuestasVFAgrupadas;
}

export interface Encuesta {
  nombre: string;
  preguntas: Pregunta[];
  fechaVencimiento: string;
}