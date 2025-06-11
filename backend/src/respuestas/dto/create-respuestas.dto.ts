import { Type } from 'class-transformer';
import { IsArray, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested} from 'class-validator';

export class PreguntaRespuestaDto {
  @IsNumber()
  preguntaId: number;

  @IsOptional()
  @IsString()
  textoLibre?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  seleccionMultiple?: string[];

  @IsOptional()
  @IsString()
  seleccionSimple?: string;
}

export class CreateRespuestasDto {
  @IsNumber()
  encuestaId: number;

  @IsString()
  @IsNotEmpty()
  codigo_respuesta: string;      

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PreguntaRespuestaDto)
  preguntas: PreguntaRespuestaDto[];  
}

