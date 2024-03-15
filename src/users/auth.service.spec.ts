import { Test } from '@nestjs/testing';

import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './users.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';

describe('AuthService', () => {
    let service: AuthService;
    let fakeUsersService: Partial<UsersService>;

    beforeEach(async () => {
        const users: User[] = [];
        fakeUsersService = {
            findByEmail: (email: string) => {
                const [filteredUser] = users.filter(u => u.email === email);
                return Promise.resolve(filteredUser);
            },
            create: async ({ name, email, password, phoneNumber })/*: Promise<CreateUserDto>*/ => {
                const user = { id: Math.floor(Math.random() * 100), name, email, password, phoneNumber } as User;
                users.push(user);

                return Promise.resolve(user);
            }
        }

        const module = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: UsersService,
                    useValue: fakeUsersService
                }
            ]
        }).compile();

        service = module.get(AuthService);
    });

    it('injects auth service', async () => {
        expect(service).toBeDefined();
    });

    it('creates a new user with hashed password', async () => {
        const user = await service.signup({ name: 'dagTad', email: 'dagtade@gmail.com', password: 'password', phoneNumber: '90909090' } as CreateUserDto);

        expect(user.email).toEqual('dagtade@gmail.com');
        expect(user.password).not.toEqual('password');

        const [salt, hash] = user.password.split('-');
        expect(salt).toBeDefined();
        expect(hash).toBeDefined();
    });

    it('rejects signup with the same email that is already existed', async () => {
        await service.signup({ name: 'dagTad', email: 'dagtade@gmail.com', password: 'password', phoneNumber: '90909090' } as CreateUserDto);

        try {
            await service.signup({ name: 'dagTad', email: 'dagtade@gmail.com', password: 'password', phoneNumber: '90909090' } as CreateUserDto);
        } catch(err) {
            expect(err).toBeInstanceOf(BadRequestException);
        }
    });

    it('rejects signin with an email that is not existed', async () => {
        try {
            await service.signin('dagtade@gmail.com', 'password');
        } catch (err) {
            expect(err).toBeInstanceOf(NotFoundException);
        }
    });

    it('rejects signin with invalid password', async () => {
        await service.signup({ name: 'dagTad', email: 'dagtade@gmail.com', password: 'password', phoneNumber: '90909090' } as CreateUserDto);
        
        try {
            await service.signin('dagtade@gmail.com', 'invalid password');
        } catch (err) {
            expect(err).toBeInstanceOf(BadRequestException);
        }
    });

    it('returns a user if a valid email and password', async () => {
        await service.signup({ name: 'dagTad', email: 'dagtade@gmail.com', password: 'password', phoneNumber: '90909090' } as CreateUserDto);
        try {
            const user = await service.signin('dagtade@gmail.com', 'password');
            expect(user).toBeDefined();
        } catch (err) {
            expect(err).toBeInstanceOf(BadRequestException);
        }
    });
});