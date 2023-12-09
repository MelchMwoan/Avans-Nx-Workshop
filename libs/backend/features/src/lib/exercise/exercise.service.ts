/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { IExercise, IRoom } from '@avans-nx-workshop/shared/api';
import { Logger } from '@nestjs/common';
import {
  CreateExerciseDto,
  UpdateExerciseDto,
} from '@avans-nx-workshop/backend/dto';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Exercise } from './exercise.schema';
import { Neo4jService } from 'nest-neo4j/dist';

@Injectable()
export class ExerciseService {
  TAG = 'ExerciseService';

  constructor(@InjectModel(Exercise.name) private exerciseModel: Model<Exercise>, private readonly neo4jService: Neo4jService) {}

  async getAll(): Promise<IExercise[]> {
    Logger.log('getAll', this.TAG);
    return (await this.exerciseModel.find().exec()).map((exercisesFromDb) => {
      return exercisesFromDb as unknown as IExercise;
    });
  }

  async getOne(identifier: string): Promise<IExercise> {
    Logger.log(`getOne(${identifier})`, this.TAG);
    const isObjectId = mongoose.Types.ObjectId.isValid(identifier);
    const exercise = await this.exerciseModel
      .findOne(isObjectId
        ? { _id: identifier }
        : { name: identifier })
      .exec();
    if (!exercise) {
      throw new NotFoundException(`Exercise could not be found!`);
    }
    return exercise as unknown as IExercise;
  }

  async delete(identifier: string, req: any): Promise<void> {
    Logger.log(`Delete(${identifier})`, this.TAG);
    try {
      const exercise = await this.exerciseModel.findOne({ name: identifier })
      if (!exercise) throw new NotFoundException(`Exercise could not be found!`);
      if(req['user'].sub != exercise.owner) throw new UnauthorizedException("You are not the owner of this entity");
      const result = await this.exerciseModel
        .deleteOne({ name: identifier })
        .exec();
      const res = await this.neo4jService.write('MATCH (e:Exercise {name: $exerName})  OPTIONAL MATCH (u1)-[r]-() DELETE e,r', {
        exerName: identifier
      });
      Logger.log(`Exercise deleted successfully`, this.TAG);
    } catch (error) {
      Logger.error(`Error deleting exercise: ${error}`, this.TAG);
      throw error;
    }
  }

  async create(exercise: CreateExerciseDto, req: any): Promise<IExercise> {
    Logger.log('create', this.TAG);
    const existingExercise = await this.exerciseModel.findOne({ name: exercise.name });
    if (existingExercise) {
      Logger.warn('Duplicate exercise', this.TAG);
      throw new ConflictException('Exercise with this name already exists');
    }
    exercise.owner = req.user.sub;
    const newExercise = exercise;
    const createdExercies = new this.exerciseModel(newExercise);
    createdExercies.save();
    
    const res = await this.neo4jService.write('MERGE (e:Exercise {name: $exerName}) ON CREATE SET e.id = $exerId, e.difficulty = $exerDifficulty WITH e MATCH (u:User {id:$userId}) MERGE (u)-[role:CREATED]->(e)', {
      exerId: String(createdExercies._id),
      exerDifficulty: createdExercies.difficulty,
      exerName: createdExercies.name,
      userId: String(createdExercies.owner)
    });

    return createdExercies as unknown as IExercise;
  }

  async update(identifier: string, exercise: UpdateExerciseDto, req: any): Promise<IExercise> {
    Logger.log('update', this.TAG);
    try {
        const existingExercise = await this.exerciseModel.findOne({ name: identifier});
        if (!existingExercise) {
            Logger.warn('Exercise not found', this.TAG);
            throw new NotFoundException('Exercise was not found');
        }
        const oldName = existingExercise.name;
        if(req['user'].sub != existingExercise.owner) throw new UnauthorizedException("You are not the owner of this entity");
        
        existingExercise.set({
          ...existingExercise.toObject() as IRoom,
          ...exercise,
      });
        const updatedExercise = await existingExercise.save();
        
        const res = await this.neo4jService.write('MATCH(e:Exercise {name:$exerciseOldName}) SET e.name = $exerciseNewName, e.difficulty = $exerciseNewDifficulty', {
          exerciseOldName: oldName,
          exerciseNewName: updatedExercise.name,
          exerciseNewDifficulty: updatedExercise.difficulty,
        });
        return updatedExercise as unknown as IExercise;
    } catch (error) {
        Logger.error(`Error updating exercise: ${error}`, this.TAG);
        if((error as Error).message.includes("E11000")) {
          throw new ConflictException('Exercise with this name already exists');
        }
        throw error;
    }
  }
}
