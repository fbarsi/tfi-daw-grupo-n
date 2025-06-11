import { Type } from 'class-transformer';
import { IsArray, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, MaxLength, ValidateNested} from 'class-validator';
import { CreateOpcionesDto } from 'src/opciones/dto/create-opciones.dto';

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
  texto: string;

  @IsEnum(TiposRespuesta)
  tipo: TiposRespuesta;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOpcionesDto)
  opciones?: CreateOpcionesDto[];
}