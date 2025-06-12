import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested
} from 'class-validator';
import { CreateOpcionesDto } from 'src/opciones/dto/create-opciones.dto';

export enum TiposRespuesta {
  ABIERTA = 'abierta',
  OPCION_MULTIPLE_SELECCION_SIMPLE = 'opcion_multiple_seleccion_simple',
  OPCION_MULTIPLE_SELECCION_MULTIPLE = 'opcion_multiple_seleccion_multiple',
  VERDADERO_FALSO = 'verdadero_falso'
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

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateOpcionesDto)
  opciones?: CreateOpcionesDto[];
}
