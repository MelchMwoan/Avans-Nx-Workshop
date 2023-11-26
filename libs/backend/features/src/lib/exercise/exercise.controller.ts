import { Controller, Delete, Put, Request, UseGuards } from '@nestjs/common';
import { Get, Param, Post, Body } from '@nestjs/common';
import { IExercise } from '@avans-nx-workshop/shared/api';
import { CreateExerciseDto, UpdateExerciseDto } from '@avans-nx-workshop/backend/dto';
import { Public } from '../auth/decorators/public.decorator';
import { AuthGuard } from '../auth/auth.guard';
import { ExerciseService } from './exercise.service';

@Controller('exercise')
export class ExerciseController {
    constructor(private exerciseService: ExerciseService) {}

    @Get('')
    @Public()
    async getAll(): Promise<IExercise[]> {
        return await this.exerciseService.getAll();
    }

    @Get(':id')
    @Public()
    async getOne(@Param('id') id: string): Promise<IExercise> {
        return await this.exerciseService.getOne(id);
    }

    @Post('')
    @UseGuards(AuthGuard)
    create(@Body() data: CreateExerciseDto): Promise<IExercise> {
        return this.exerciseService.create(data);
    }

    @Delete(':id')
    @UseGuards(AuthGuard)
    async delete(@Param('id') id: string, @Request() req: any): Promise<void> {
        return await this.exerciseService.delete(id, req);
    }

    @Put(':id')
    @UseGuards(AuthGuard)
    async update(@Param('id') id: string, @Body() data: UpdateExerciseDto, @Request() req: any): Promise<IExercise> {
        return await this.exerciseService.update(id, data, req);
    }
}
