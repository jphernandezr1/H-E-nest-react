import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CantidadDto {
    @IsNumber()
    @IsNotEmpty()
    readonly cantidad: string;

    @IsString()
    @IsNotEmpty()
    readonly unidad: string;

}
