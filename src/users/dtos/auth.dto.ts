import { Expose } from 'class-transformer';
import { IsEmail, IsString } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

export class AuthDto {
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