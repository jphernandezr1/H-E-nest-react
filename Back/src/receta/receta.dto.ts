import {IsNotEmpty, IsString} from 'class-validator';
export class RecetaDto {

    @IsString()
    @IsNotEmpty()
    readonly nombre: string;

    @IsString()
    @IsNotEmpty()
    readonly descripcion: string;

    @IsString()
    @IsNotEmpty()
    readonly especificaciones: string;

    @IsString()
    @IsNotEmpty()
    readonly infoAdicional: string;
}
