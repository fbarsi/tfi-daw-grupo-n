import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
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
  numerosOpciones?: number[];

  @IsString()
  @IsOptional()
  texto?: string;

  @IsBoolean()
  @IsOptional()
  opcion?: boolean;
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
