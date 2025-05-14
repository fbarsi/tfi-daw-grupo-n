import { IsInt, IsNotEmpty, IsString, MaxLength } from "class-validator";

export class CreateOpcionesDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    texto: string;

    @IsInt()
    @IsNotEmpty()
    numero: number;
}
