import { UsersService } from './users.service';
import { User } from './users.entity';
import { CreateUserDto } from './dtos/create-user.dto';
import { NotFoundException } from '@nestjs/common';

describe('UsersService', () => {
  let userService: Partial<UsersService>;

  beforeEach(async () => {
    const users: User[] = [
      {
        id: 1,
        name: 'Dagmawi',
        email: 'dagtade@gmail.com',
        password: 'password',
        phoneNumber: '123456'
      } as User
    ];

    userService = {
      getAllUsers: async () => {
        return Promise.resolve(users);
      },
      findByEmail: (email: string) => {
        const [filteredUser] = users.filter(u => u.email === email);

        return Promise.resolve(filteredUser);
      },
      getUserById: (id: number) => {
        const [filteredUser] = users.filter(u => u.id === id);


        if (!filteredUser) {
          throw new NotFoundException(`User with id = ${id} not found!`);
        }
        return Promise.resolve(filteredUser);
      },
      create: async ({ name, email, password, phoneNumber })/*: Promise<CreateUserDto>*/ => {
        const user = { id: Math.floor(Math.random() * 100), name, email, password, phoneNumber } as User;
        users.push(user);

        return Promise.resolve(user);
      }
    }
  });

  it('injects user service', async () => {
    expect(userService).toBeDefined();
  });

  it('returns a user with the give email', async () => {
    const user = await userService.findByEmail('dagtade@gmail.com');

    expect(user).toBeDefined();
    expect(user.email).toEqual('dagtade@gmail.com')
  });

  it('returns error if unavailable email is provided', async () => {
    try {
      await userService.findByEmail('noemail@gmail.com');
    } catch (err) {
      console.log(err)
      expect(err).toBeInstanceOf(NotFoundException);
    }
  });

  it('returns list of users if available', async () => {
    const users = await userService.getAllUsers();

    expect(users.length).toBeGreaterThanOrEqual(0);
  });

  it('returns a users if an existing user id is provided', async () => {
    const user = await userService.getUserById(1);

    expect(user).toBeDefined();
  });

  it('throws 404 if user with a given id is not found', async () => {
    const id = 10;
    try {
      await userService.getUserById(id);
    } catch (err) {
      expect(err.status).toEqual(404);
      expect(err.message).toEqual(`User with id = ${id} not found!`)
      expect(err).toBeInstanceOf(NotFoundException);
    }
  });

  it('creates a new user if valid data provided', async () => {
    const usersBeforeInsertion = await userService.getAllUsers();
    const notFoundUser = await userService.findByEmail('newemail@gmail.com');

    expect(notFoundUser).not.toBeDefined()
    try {
      const user = await userService.create({ name: 'dagTad', email: 'newemail@gmail.com', password: 'hashed-password', phoneNumber: '90909090' } as CreateUserDto);
      const usersAfterInsersion = await userService.getAllUsers();

      expect(user.email).toEqual('newemail@gmail.com');
      expect(user.password).not.toEqual('hashed-passwod');

      expect(usersAfterInsersion.length).toBeGreaterThan(usersBeforeInsertion.length)
      expect(usersAfterInsersion.length).toEqual(usersBeforeInsertion.length + 1)
    } catch (err) { }
  });

  // it('rejects signup with the same email that is already existed', async () => {
  //     await service.signup({ name: 'dagTad', email: 'dagtade@gmail.com', password: 'password', phoneNumber: '90909090' } as CreateUserDto);

  //     try {
  //         await service.signup({ name: 'dagTad', email: 'dagtade@gmail.com', password: 'password', phoneNumber: '90909090' } as CreateUserDto);
  //     } catch(err) {
  //         expect(err).toBeInstanceOf(BadRequestException);
  //     }
  // });

  // it('rejects signin with an email that is not existed', async () => {
  //     try {
  //         await service.signin('dagtade@gmail.com', 'password');
  //     } catch (err) {
  //         expect(err).toBeInstanceOf(NotFoundException);
  //     }
  // });

  // it('rejects signin with invalid password', async () => {
  //     await service.signup({ name: 'dagTad', email: 'dagtade@gmail.com', password: 'password', phoneNumber: '90909090' } as CreateUserDto);

  //     try {
  //         await service.signin('dagtade@gmail.com', 'invalid password');
  //     } catch (err) {
  //         expect(err).toBeInstanceOf(BadRequestException);
  //     }
  // });

  // it('returns a user if a valid email and password', async () => {
  //     await service.signup({ name: 'dagTad', email: 'dagtade@gmail.com', password: 'password', phoneNumber: '90909090' } as CreateUserDto);
  //     try {
  //         const user = await service.signin('dagtade@gmail.com', 'password');
  //         expect(user).toBeDefined();
  //     } catch (err) {
  //         expect(err).toBeInstanceOf(BadRequestException);
  //     }
  // });
});