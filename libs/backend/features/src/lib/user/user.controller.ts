import { Controller, Delete, Put, Request, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { Get, Param, Post, Body } from '@nestjs/common';
import { IPlayer, ITrainer } from '@avans-nx-workshop/shared/api';
import { CreateUserDto, UpdateUserDto } from '@avans-nx-workshop/backend/dto';
import { Public } from '../auth/decorators/public.decorator';
import { AuthGuard } from '../auth/auth.guard';

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
    @UseGuards(AuthGuard)
    async delete(@Param('id') id: string, @Request() req: any): Promise<void> {
        return await this.userService.delete(id, req);
    }

    @Put(':id')
    @Public()
    async update(@Param('id') id: string, @Body() data: UpdateUserDto): Promise<(IPlayer | ITrainer)> {
        return await this.userService.update(id, data);
    }
}
