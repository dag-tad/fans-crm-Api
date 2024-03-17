const jwt = require('jsonwebtoken');
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { BadRequestException, Injectable, NotFoundException, UseGuards } from '@nestjs/common';
import { promisify } from 'util';

import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { User } from './users.entity';


const scrypt = promisify(_scrypt);
@Injectable()
export class AuthService {
    private _signToken = (email: string): string => {
        return jwt.sign({ email }, 'jwt-secret', { expiresIn: '1d' });
    }

    constructor(private userService: UsersService) { }

    async signup(user: CreateUserDto) {
        const { email, password } = user;
        const _users = await this.userService.findByEmail(email);

        if (_users) {
            throw new BadRequestException('Email already exist')
        }

        const hashPassword = await this.userService.hashPassword(password);

        user.password = hashPassword;
        const newUser = await this.userService.create(user);

        const token = this._signToken(newUser.email);

        Object.assign(newUser, { token });

        return newUser
    }

    async signin(email: string, password: string) {
        const user = await this.userService.findByEmail(email);

        if (!user) {
            throw new NotFoundException('User not found')
        }

        const [salt, storedHash] = user.password.split('.');

        const hash = await scrypt(password, salt, 32) as Buffer;

        if (storedHash !== hash.toString('hex')) {
            throw new BadRequestException('Invalid email or password!')
        }

        const token = this._signToken(user.email);

        Object.assign(user, { token })

        return user;
    }

    async findBytoken(token: string): Promise<User> {
        const decoded = await jwt.verify(token, 'jwt-secret');
        const email = decoded.email;
        const user = await this.userService.findByEmail(email);

        Object.assign(user, { token });

        return user;
    }

    async validateToken(token: string) {
        try {
            const decoded = await jwt.verify(token, 'jwt-secret');

            const now = new Date().getTime();

            if (decoded.iat > now) {
                return false;
            }
            const email = decoded.email;

            const user = await this.userService.findByEmail(email);

            if (!user) {
                return false
            }
            return true;
        } catch (err) {
            return false;
        }
    }
}
