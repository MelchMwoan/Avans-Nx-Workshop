import { Controller, Delete, Put, Request, UseGuards } from '@nestjs/common';
import { Get, Param, Post, Body } from '@nestjs/common';
import { IEnrollment, IExercise, ITraining } from '@avans-nx-workshop/shared/api';
import { CreateTrainingDto, UpdateTrainingDto } from '@avans-nx-workshop/backend/dto';
import { Public } from '../auth/decorators/public.decorator';
import { AuthGuard } from '../auth/auth.guard';
import { TrainingService } from './training.service';
import { Trainer } from '../auth/decorators/trainer.decorator';

@Controller('training')
export class TrainingController {
    constructor(private trainingService: TrainingService) {}

    @Get('')
    @Public()
    async getAll(): Promise<ITraining[]> {
        return await this.trainingService.getAll();
    }

    @Get(':id')
    @Public()
    async getOne(@Param('id') id: string): Promise<ITraining> {
        return await this.trainingService.getOne(id);
    }

    @Post('')
    @UseGuards(AuthGuard)
    @Trainer()
    create(@Body() data: CreateTrainingDto, @Request() req: any): Promise<ITraining> {
        return this.trainingService.create(data, req);
    }

    @Delete(':id')
    @UseGuards(AuthGuard)
    @Trainer()
    async delete(@Param('id') id: string, @Request() req: any): Promise<void> {
        return await this.trainingService.delete(id, req);
    }

    @Put(':id')
    @UseGuards(AuthGuard)
    @Trainer()
    async update(@Param('id') id: string, @Body() data: UpdateTrainingDto, @Request() req: any): Promise<IExercise> {
        return await this.trainingService.update(id, data, req);
    }
    
    @Post('join/:id')
    @UseGuards(AuthGuard)
    join(@Param('id') id: string, @Request() req: any): Promise<IEnrollment> {
        return this.trainingService.join(id, req);
    }
    
    @Delete('leave/:id')
    @UseGuards(AuthGuard)
    leave(@Param('id') id: string, @Request() req: any): Promise<void> {
        return this.trainingService.leave(id, req);
    }

    @Get(':id/enrollments')
    @Public()
    getEnrollmentsByTraining(@Param('id') id: string, @Request() req: any): Promise<IEnrollment[]> {
        return this.trainingService.getEnrollmentsByTraining(id, req);
    }
}
