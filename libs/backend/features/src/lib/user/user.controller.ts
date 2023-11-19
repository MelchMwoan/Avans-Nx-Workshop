import { Controller, Delete, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { Get, Param, Post, Body } from '@nestjs/common';
import { IPlayer, ITrainer, IUser } from '@avans-nx-workshop/shared/api';
import { CreatePlayerDto, CreateTrainerDto, UpdateUserDto } from '@avans-nx-workshop/backend/dto';

@Controller('user')
export class UserController {
    constructor(private userService: UserService) {}

    @Get('')
    getAll(): (IPlayer | ITrainer)[] {
        return this.userService.getAll();
    }

    @Get(':id')
    getOne(@Param('id') id: string): (IPlayer | ITrainer) {
        return this.userService.getOne(id);
    }

    @Post('')
    create(@Body() data: CreatePlayerDto | CreateTrainerDto): (IPlayer | ITrainer) {
        if ('rating' in data) {
            return this.userService.create(data);
        } else {
            return this.userService.create(data);
        }
    }

    @Delete(':id')
    delete(@Param('id') id: string): void {
        this.userService.delete(id);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() data: UpdateUserDto): (IPlayer | ITrainer) {
        return this.userService.update(id, data);
    }
}
