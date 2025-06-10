export interface Opcion {
  numero: number;
  texto: string;
}

export interface Pregunta {
  numero: number;
  texto: string;
  tipo: 'abierta' | 'opcion_multiple_seleccion_simple' | 'opcion_multiple_seleccion_multiple';
  opciones: Opcion[];
}

export interface Encuesta {
  nombre: string;
  preguntas: Pregunta[];
}