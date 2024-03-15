import { Expose } from 'class-transformer';
import { IsEmail, IsString } from 'class-validator';

export class AuthDto {
    @Expose()
    id?: number;

    @Expose()
    @IsString()
    name: string;

    @Expose()
    @IsEmail()
    email: string;

    @IsString()
    password: string;

    @Expose()
    @IsString()
    phoneNumber: string;

    @Expose()
    token: string;
}