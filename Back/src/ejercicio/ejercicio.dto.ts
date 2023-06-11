/* eslint-disable prettier/prettier */
import {IsNotEmpty, IsString, IsNumber} from 'class-validator';

export class EjercicioDto {
    @IsString()
    @IsNotEmpty()
    readonly id: string;

    @IsString()
    @IsNotEmpty()
    readonly tipo: string;

    @IsNumber()
    @IsNotEmpty()
    readonly duracion: number;

    @IsNumber()
    @IsNotEmpty()
    readonly numRepeiciones: number;

    @IsString()
    @IsNotEmpty()
    readonly infoAdicional: string;
}
