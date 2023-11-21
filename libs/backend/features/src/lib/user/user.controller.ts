import { Controller, Delete, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { Get, Param, Post, Body } from '@nestjs/common';
import { IPlayer, ITrainer } from '@avans-nx-workshop/shared/api';
import { CreateUserDto, UpdateUserDto } from '@avans-nx-workshop/backend/dto';
import { Public } from '../auth/decorators/public.decorator';

@Controller('user')
//TODO: Remove public where not needed
export class UserController {
    constructor(private userService: UserService) {}

    @Get('')
    @Public()
    async getAll(): Promise<(IPlayer | ITrainer)[]> {
        return await this.userService.getAll();
    }

    @Get(':id')
    @Public()
    async getOne(@Param('id') id: string): Promise<(IPlayer | ITrainer)> {
        return await this.userService.getOne(id);
    }

    @Post('')
    @Public()
    create(@Body() data: CreateUserDto): Promise<(IPlayer | ITrainer)> {
        return this.userService.create(data);
    }

    @Delete(':id')
    @Public()
    delete(@Param('id') id: string): void {
        this.userService.delete(id);
    }

    @Put(':id')
    @Public()
    async update(@Param('id') id: string, @Body() data: UpdateUserDto): Promise<(IPlayer | ITrainer)> {
        return await this.userService.update(id, data);
    }
}
