import { IsInt, IsNotEmpty } from 'class-validator';

export class CreateRespuestasOpcionesDto {
  @IsInt()
  @IsNotEmpty()
  id_respuesta: number;

  @IsInt()
  @IsNotEmpty()
  id_opcion: number;
}
