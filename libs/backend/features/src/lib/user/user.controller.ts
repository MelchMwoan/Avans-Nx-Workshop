import { Controller, Delete, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { Get, Param, Post, Body } from '@nestjs/common';
import { IPlayer, ITrainer } from '@avans-nx-workshop/shared/api';
import { CreateUserDto, UpdateUserDto } from '@avans-nx-workshop/backend/dto';
import { Public } from '../auth/decorators/public.decorator';

@Controller('user')
export class UserController {
    constructor(private userService: UserService) {}

    @Get('')
    @Public()
    getAll(): (IPlayer | ITrainer)[] {
        return this.userService.getAll();
    }

    @Get(':id')
    @Public()
    getOne(@Param('id') id: string): (IPlayer | ITrainer) {
        return this.userService.getOne(id);
    }

    @Post('')
    @Public()
    create(@Body() data: CreateUserDto): Promise<(IPlayer | ITrainer)> {
        return this.userService.create(data);
    }

    @Delete(':id')
    delete(@Param('id') id: number): void {
        this.userService.delete(id);
    }

    @Put(':id')
    update(@Param('id') id: number, @Body() data: UpdateUserDto): (IPlayer | ITrainer) {
        return this.userService.update(id, data);
    }
}
