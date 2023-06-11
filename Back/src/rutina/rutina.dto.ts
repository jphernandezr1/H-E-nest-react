/* eslint-disable prettier/prettier */
import {IsNotEmpty, IsString} from 'class-validator';

export class RutinaDto {

    @IsString()
    @IsNotEmpty()
    readonly nombre: string;

    @IsString()
    @IsNotEmpty()
    readonly infoAdicional: string;
}
