import { Controller } from '@nestjs/common';
import { UserService } from './user.service';
import { Get, Param, Post, Body } from '@nestjs/common';
import { IUser } from '@avans-nx-workshop/shared/api';
import { CreateUserDto } from '@avans-nx-workshop/backend/dto';

@Controller('user')
export class UserController {
    constructor(private userService: UserService) {}

    @Get('')
    getAll(): IUser[] {
        return this.userService.getAll();
    }

    @Get(':id')
    getOne(@Param('id') id: string): IUser {
        return this.userService.getOne(id);
    }

    @Post('')
    create(@Body() data: CreateUserDto): IUser {
        return this.userService.create(data);
    }
}
