import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';

export class PreguntasDto {
  @IsInt()
  @IsNotEmpty()
  numero: number;

  @IsArray()
  @IsInt({ each: true })
  @IsOptional()
  opcionesNro?: number[];

  @IsString()
  @IsOptional()
  texto?: string;
}

export class CreateRespuestasDto {
  @IsUUID()
  @IsNotEmpty()
  codigo_respuesta: string;

  @IsArray()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => PreguntasDto)
  preguntas: PreguntasDto[];
}
