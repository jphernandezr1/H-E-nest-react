import { IsString, IsNotEmpty } from "class-validator";

export class UserDTO{

    @IsString()
    @IsNotEmpty()
    readonly name: string;

    @IsString()
    @IsNotEmpty()
    readonly password: string;
}
