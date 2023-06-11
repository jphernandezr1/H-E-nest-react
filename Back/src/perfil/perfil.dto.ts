import {IsEmail, IsNotEmpty, IsNumber, IsString} from 'class-validator';
export class PerfilDto {
  @IsString()
  @IsNotEmpty()  
  readonly nombre: string;

  @IsEmail()
  @IsNotEmpty() 
  correo: string;

  @IsString()
  @IsNotEmpty()
  readonly fechaDeNacimiento: string;

  @IsNumber()
  @IsNotEmpty()
  readonly documento: number;
}
