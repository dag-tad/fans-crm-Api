import { Expose } from 'class-transformer';
import { IsEmail, IsString } from 'class-validator';

export class SigninDto {
    @Expose()
    @IsEmail()
    email: string;

    @IsString()
    password: string;
}