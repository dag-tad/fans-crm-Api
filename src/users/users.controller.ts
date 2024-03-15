import { BadRequestException, Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';

import { CreateUserDto } from './dtos/create-user.dto';
import { AuthService } from 'src/users/auth.service';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { AuthDto } from './dtos/auth.dto';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller()
export class UsersController {
    constructor(private service: UsersService, private authService: AuthService) { }

    @UseGuards(AuthGuard)
    @Get('get-user/:id')
    getUser(@Param('id') id: string) {
        if (isNaN(Number(id))) {
            throw new BadRequestException(`${id} must be number`)
        }
        return this.service.getUserById(parseInt(id));
    }

    @UseGuards(AuthGuard)
    @Get('get-all')
    getAllUser() {
        return this.service.getAllUsers();
    }

    @UseGuards(AuthGuard)
    @Post('add-user')
    async addUser(@Body() body: CreateUserDto) {
        return await this.service.create(body);
    }

    @Serialize(AuthDto)
    @Post('signup')
    async signup(@Body() body: CreateUserDto) {
        return await this.authService.signUp(body);
    }

    @Serialize(AuthDto)
    @Post('signin')
    async signIn(@Body() body: Partial<CreateUserDto>, /* @Session() session: any */) {
        const { email, password } = body;

        const user = await this.authService.signin(email, password);

        return user;
    }
}