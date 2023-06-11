import { IsNotEmpty, IsNumber, IsString } from "class-validator";
export class IngredienteDto {

    @IsString()
    @IsNotEmpty()
    readonly nombre: string;

    @IsString()
    @IsNotEmpty()
    readonly descripcion: string;

    @IsNumber()
    @IsNotEmpty()
    readonly calorias: number;

    @IsString()
    @IsNotEmpty()
    readonly infoAdicional: string;
}
