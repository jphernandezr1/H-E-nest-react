import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
export class ForoDto {
  
  @IsString()
  @IsNotEmpty()
  readonly titulo: string;

  @IsNumber()
  @IsNotEmpty()
  readonly numPublicaciones: number;
}
