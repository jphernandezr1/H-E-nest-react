import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
export class PublicacionDto {

  @IsString()
  @IsNotEmpty()
  readonly texto: string;

  @IsNumber()
  @IsNotEmpty()
  readonly numMegusta: number;
}
