import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './users.entity';
import { CreateUserDto } from './dtos/create-user.dto';

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
