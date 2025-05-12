import { IsInt, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateRespuestasAbiertasDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  texto: string;

  @IsInt()
  @IsNotEmpty()
  id_pregunta: number;

  @IsInt()
  @IsNotEmpty()
  id_respuesta: number;
}
