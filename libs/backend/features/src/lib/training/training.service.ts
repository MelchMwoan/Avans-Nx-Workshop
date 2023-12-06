/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { IExercise, ITraining } from '@avans-nx-workshop/shared/api';
import { Logger } from '@nestjs/common';
import {
  CreateTrainingDto,
  UpdateTrainingDto,
} from '@avans-nx-workshop/backend/dto';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Training } from './training.schema';
import { User } from '../user/user.schema';
import { Exercise } from '../exercise/exercise.schema';
import { Room } from '../room/room.schema';

@Injectable()
export class TrainingService {
  TAG = 'TrainingService';

  constructor(@InjectModel(Training.name) private trainingModel: Model<Training>, @InjectModel(Room.name) private roomModel: Model<Room>, @InjectModel(User.name) private userModel: Model<User>, @InjectModel(Exercise.name) private exerciseModel: Model<Exercise>) {}

  async getAll(): Promise<ITraining[]> {
    Logger.log('getAll', this.TAG);
    return (await this.trainingModel.find().exec()).map((trainingsFromDb) => {
      return trainingsFromDb as ITraining;
    });
  }

  async getOne(identifier: string): Promise<ITraining> {
    Logger.log(`getOne(${identifier})`, this.TAG);
    const isObjectId = mongoose.Types.ObjectId.isValid(identifier);
    const training = await this.trainingModel
      .findOne(isObjectId
        ? { _id: identifier }
        : { name: identifier })
      .exec();
    if (!training) {
      throw new NotFoundException(`Training could not be found!`);
    }
    return training as ITraining;
  }

  async delete(identifier: string, req: any): Promise<void> {
    Logger.log(`Delete(${identifier})`, this.TAG);
    try {
      const training = await this.trainingModel.findOne({ name: identifier })
      if (!training) throw new NotFoundException(`Training could not be found!`);
      if(!training.trainers.includes(req['user'].sub)) throw new UnauthorizedException("You are not the owner of this entity");
      const result = await this.trainingModel
        .deleteOne({ name: identifier })
        .exec();
      Logger.log(`Training deleted successfully`, this.TAG);
    } catch (error) {
      Logger.error(`Error deleting training: ${error}`, this.TAG);
      throw error;
    }
  }

  async create(training: CreateTrainingDto, req: any): Promise<ITraining> {
    Logger.log('create', this.TAG);

    const existingTraining = await this.trainingModel.findOne({ name: training.name });  
    if (existingTraining) {
      Logger.warn('Duplicate training', this.TAG);
      throw new ConflictException('Training with this name already exists');
    }
  
    await this.validateReferencesExist([training.roomId], "Room not found", this.roomModel);
    await this.validateReferencesExist(training.exercises, "One or more exercises not found", this.exerciseModel);
    await this.validateReferencesExist(training.trainers, "One or more trainers not found", this.userModel);
    try {
      const newTraining = {
        ...training
      };
      if(training.trainers == null) {
        newTraining.trainers = [req.user.sub]
      } else {
        newTraining.trainers.indexOf(req.user.sub) == -1 ? newTraining.trainers.push(req.user.sub) : null
      }
      const createdTraining = new this.trainingModel(newTraining);
      await createdTraining.save();
      return createdTraining as ITraining;

    } catch (error:any) {
      Logger.error('Unexpected Error:', error);
      throw new BadRequestException(error.message);
    }
  }
  private async validateReferencesExist(ids: string[] | undefined, errorMessage: string, collection: Model<any>): Promise<void> {
    try {
      if (ids && ids.length > 0) {
        const count = await collection.countDocuments({ _id: { $in: ids } });
        if (count !== ids.length) {
          throw new NotFoundException(errorMessage);
        }
      }
    } catch (error) {
      Logger.error(errorMessage, this.TAG)
      throw new NotFoundException(errorMessage);
    }
  }
  

  async update(identifier: string, training: UpdateTrainingDto, req: any): Promise<ITraining> {
    Logger.log('update', this.TAG);
    try {
        const existingTraining = await this.trainingModel.findOne({ name: identifier});
        if (!existingTraining) {
            Logger.warn('Training not found', this.TAG);
            throw new NotFoundException('Training was not found');
        }
        if(!existingTraining.trainers.includes(req['user'].sub)) throw new UnauthorizedException("You are not an owner of this entity");
        
  
        await this.validateReferencesExist([training.roomId], "Room not found", this.roomModel);
        await this.validateReferencesExist(training.exercises, "One or more exercises not found", this.exerciseModel);
        await this.validateReferencesExist(training.trainers, "One or more trainers not found", this.userModel);
        
        existingTraining.set({
          ...existingTraining.toObject() as ITraining,
          ...training,
      });
      Logger.log(existingTraining);
        const updatedTraining = await existingTraining.save();
        return updatedTraining as ITraining;
    } catch (error) {
        Logger.error(`Error updating training: ${error}`, this.TAG);
        if((error as Error).message.includes("E11000")) {
          throw new ConflictException('Training with this name already exists');
        }
        throw error;
    }
  }
}
