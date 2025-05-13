import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { CreatePreguntasDto } from 'src/preguntas/dto/create-preguntas.dto';

export class CreateEncuestasDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePreguntasDto)
  preguntas: CreatePreguntasDto[];
}
