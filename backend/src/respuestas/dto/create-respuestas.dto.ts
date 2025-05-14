import { IsArray, IsInt, IsOptional, IsString } from "class-validator";

class RespuestaOpcionDto {
  @IsInt()
  numero: number;

  @IsArray()
  @IsInt({ each: true })
  @IsOptional()
  id_opciones?: number[];

  @IsString()
  @IsOptional()
  texto?: string;
}

export class CreateRespuestasDto {

  codigo_respuesta: string;

  preguntas: RespuestaOpcionDto[];
}
