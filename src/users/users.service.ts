import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './users.entity';
import { CreateUserDto } from './dtos/create-user.dto';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

@Injectable()
export class UsersService {
    constructor(@InjectModel(User) private model: typeof User) { }

    async getAllUsers() {
        return await this.model.findAll();
    }

    async getUserById(id: number) {
        const user = await this.model.findOne({
            where: {
                id
            }
        });

        if (!user) {
            throw new NotFoundException(`User with id = ${id} not found!`);
        }

        return user;
    }

    async hashPassword(password: string){
        const salt = randomBytes(8).toString('hex');
        const hash = await scrypt(password, salt, 32) as Buffer;
        const result = salt + '.' + hash.toString('hex');

        return result
    }

    async create(user: CreateUserDto)/*: Promise<User> */ {
        const { name, email, phoneNumber, password } = user;

        return await this.model.create({ name, email, phoneNumber, password });
    }

    async findByEmail(email: string): Promise<User> {
        const user = await this.model.findOne({
            where: {
                email
            }
        });

        return user;
    }
}
