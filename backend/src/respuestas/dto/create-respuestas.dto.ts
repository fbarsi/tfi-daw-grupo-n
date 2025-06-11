import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsNumber,
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
  @IsNumber()
  encuestaId: number;

  @IsOptional()
  @IsString()
  seleccionSimple?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => String)
  seleccionMultiple?: string[];

  @IsOptional()
  @IsString()
  textoLibre?: string;
}

