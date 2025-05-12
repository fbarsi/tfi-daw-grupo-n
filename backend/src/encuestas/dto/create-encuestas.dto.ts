import { IsNotEmpty, IsString } from 'class-validator';

export class CreateEncuestasDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsNotEmpty()
  codigo_respuesta: string;

  @IsString()
  @IsNotEmpty()
  codigo_resultados: string;
}
