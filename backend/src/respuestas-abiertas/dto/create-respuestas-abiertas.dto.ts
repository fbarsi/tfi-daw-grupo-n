import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateRespuestasAbiertasDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  texto: string;
}
