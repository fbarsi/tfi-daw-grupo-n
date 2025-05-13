import { IsInt, IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";

export class CreateOpcionesDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    texto: string;

    @IsInt()
    @IsNotEmpty()
    numero: number;

    @IsInt()
    @IsOptional()
    id_pregunta?: number;
}
