import {IsNotEmpty, IsNumber, IsString} from 'class-validator';
export class MetricasDto {

    @IsString()
    @IsNotEmpty()
    readonly nombre: string;

    @IsString()
    @IsNotEmpty()
    readonly unidad: string;

    @IsNumber()
    @IsNotEmpty()
    valor: number;
}
