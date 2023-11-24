import { Controller, Delete, Put, Request, UseGuards } from '@nestjs/common';
import { Get, Param, Post, Body } from '@nestjs/common';
import { IRoom } from '@avans-nx-workshop/shared/api';
import { CreateRoomDto, UpdateRoomDto } from '@avans-nx-workshop/backend/dto';
import { Public } from '../auth/decorators/public.decorator';
import { AuthGuard } from '../auth/auth.guard';
import { RoomService } from './room.service';

@Controller('room')
export class RoomController {
    constructor(private roomService: RoomService) {}

    @Get('')
    @Public()
    async getAll(): Promise<IRoom[]> {
        return await this.roomService.getAll();
    }

    @Get(':id')
    @Public()
    async getOne(@Param('id') id: string): Promise<IRoom> {
        return await this.roomService.getOne(id);
    }

    @Post('')
    @Public()
    create(@Body() data: CreateRoomDto): Promise<IRoom> {
        return this.roomService.create(data);
    }

    @Delete(':id')
    @UseGuards(AuthGuard)
    async delete(@Param('id') id: string, @Request() req: any): Promise<void> {
        return await this.roomService.delete(id, req);
    }

    @Put(':id')
    @UseGuards(AuthGuard)
    async update(@Param('id') id: string, @Body() data: UpdateRoomDto, @Request() req: any): Promise<IRoom> {
        return await this.roomService.update(id, data, req);
    }
}
