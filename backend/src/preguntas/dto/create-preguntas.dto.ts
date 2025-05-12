import { IsEnum, IsInt, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export enum TiposRespuesta {
  ABIERTA = 'abierta',
  OPCION_MULTIPLE_SELECCION_SIMPLE = 'opcion_multiple_seleccion_simple',
  OPCION_MULTIPLE_SELECCION_MULTIPLE = 'opcion_multiple_seleccion_multiple',
}

export class CreatePreguntasDto {
  @IsInt()
  @IsNotEmpty()
  numero: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  texto: string;

  @IsNotEmpty()
  @IsEnum(TiposRespuesta, {
    message: `El tipo debe ser uno de: ${Object.values(TiposRespuesta).join(', ')}`,
  })
  tipo: TiposRespuesta;

  @IsInt()
  @IsNotEmpty()
  id_encuesta: number;
}
