import { IsBoolean, IsNotEmpty } from 'class-validator';

export class CreateRespuestasVerdaderoFalsoDto {
  @IsBoolean()
  @IsNotEmpty()
  opcion: boolean;
}
