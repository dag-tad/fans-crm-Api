import { Expose } from 'class-transformer';
import { IsEmail, IsString } from 'class-validator';

export class CreateUserDto {
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
}