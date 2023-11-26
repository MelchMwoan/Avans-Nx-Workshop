/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { IExercise, IRoom } from '@avans-nx-workshop/shared/api';
import { Logger } from '@nestjs/common';
import {
  CreateExerciseDto,
  UpdateExerciseDto,
} from '@avans-nx-workshop/backend/dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Exercise } from './exercise.schema';

@Injectable()
export class ExerciseService {
  TAG = 'ExerciseService';

  constructor(@InjectModel(Exercise.name) private exerciseModel: Model<Exercise>) {}

  async getAll(): Promise<IExercise[]> {
    Logger.log('getAll', this.TAG);
    return (await this.exerciseModel.find().exec()).map((exercisesFromDb) => {
      return exercisesFromDb as IExercise;
    });
  }

  async getOne(identifier: string): Promise<IExercise> {
    Logger.log(`getOne(${identifier})`, this.TAG);
    const exercise = await this.exerciseModel
      .findOne({ $or: [{ name: identifier }] })
      .exec();
    if (!exercise) {
      throw new NotFoundException(`Exercise could not be found!`);
    }
    return exercise as IExercise;
  }

  async delete(identifier: string, req: any): Promise<void> {
    //TODO: Authentication
    Logger.log(`Delete(${identifier})`, this.TAG);
    try {
      const exercise = await this.exerciseModel.findOne({ name: identifier })
      if (!exercise) throw new NotFoundException(`Exercise could not be found!`);
      // if(req['user'].email != user?.email) throw new UnauthorizedException("You are not the owner of this entity");
      const result = await this.exerciseModel
        .deleteOne({ name: identifier })
        .exec();
      Logger.log(`Exercise deleted successfully`, this.TAG);
    } catch (error) {
      Logger.error(`Error deleting exercise: ${error}`, this.TAG);
      throw error;
    }
  }

  async create(exercise: CreateExerciseDto): Promise<IExercise> {
    Logger.log('create', this.TAG);
    const existingExercise = await this.exerciseModel.findOne({ name: exercise.name });
    if (existingExercise) {
      Logger.warn('Duplicate exercise', this.TAG);
      throw new ConflictException('Exercise with this name already exists');
    }
    const newExercise = exercise;
    const createdExercies = new this.exerciseModel(newExercise);
    createdExercies.save();
    return createdExercies as IExercise;
  }

  async update(identifier: string, exercise: UpdateExerciseDto, req: any): Promise<IExercise> {
    Logger.log('update', this.TAG);
    try {
        const existingExercise = await this.exerciseModel.findOne({ name: identifier});
        if (!existingExercise) {
            Logger.warn('Exercise not found', this.TAG);
            throw new NotFoundException('Exercise was not found');
        }
        // if(req['user'].email != existingUser.email) throw new UnauthorizedException("You are not the owner of this entity");
        
        existingExercise.set({
          ...existingExercise.toObject() as IRoom,
          ...exercise,
      });
        const updatedExercise = await existingExercise.save();
        return updatedExercise as IExercise;
    } catch (error) {
        Logger.error(`Error updating exercise: ${error}`, this.TAG);
        if((error as Error).message.includes("E11000")) {
          throw new ConflictException('Exercise with this name already exists');
        }
        throw error;
    }
  }
}