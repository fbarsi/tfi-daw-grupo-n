import { IsInt, IsNotEmpty } from 'class-validator';

export class CreateRespuestasDto {
  @IsInt()
  @IsNotEmpty()
  id_encuesta: number;
}
