import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './users.entity';
import { AuthService } from 'src/users/auth.service';

@Module({
  imports: [SequelizeModule.forFeature([User])],
  controllers: [UsersController],
  providers: [
    AuthService,
    UsersService, 
  ],
  exports: [UsersService]
})
export class UsersModule {}
