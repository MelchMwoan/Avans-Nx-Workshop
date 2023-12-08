/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ICreateEnrollment, IEnrollment, IExercise, IPlayer, ITraining } from '@avans-nx-workshop/shared/api';
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
import { Enrollment } from './enrollment.schema';
import { Neo4jService } from 'nest-neo4j/dist';

@Injectable()
export class TrainingService {
  TAG = 'TrainingService';

  constructor(@InjectModel(Training.name) private trainingModel: Model<Training>, @InjectModel(Room.name) private roomModel: Model<Room>, @InjectModel(User.name) private userModel: Model<User>, @InjectModel(Exercise.name) private exerciseModel: Model<Exercise>, @InjectModel(Enrollment.name) private enrollmentModel: Model<Enrollment>, private readonly neo4jService: Neo4jService) {}

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
        const res = await this.neo4jService.write('MATCH (t:Training {name: $trainingName}) OPTIONAL MATCH (t)-[r]-() DELETE t,r', {
          trainingName: identifier
        });
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
      console.log(createdTraining.trainers.map(objectId => String(objectId)));
    const res = await this.neo4jService.write('MERGE (t:Training {name: $trainingName}) ON CREATE SET t.id = $trainingId, t.difficulty = $trainingDifficulty WITH t MATCH (u:User) WHERE u.id IN $trainingTrainers MERGE (u)-[r:HOST]->(t)', {
      trainingId: String(createdTraining._id),
      trainingDifficulty: createdTraining.difficulty,
      trainingName: createdTraining.name,
      trainingTrainers: createdTraining.trainers.map(objectId => String(objectId))
    });

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

  async join(identifier: string, req: any): Promise<IEnrollment> {
    Logger.log('join', this.TAG);
    const isObjectId = mongoose.Types.ObjectId.isValid(identifier);
    const training = await this.trainingModel
      .findOne(isObjectId
        ? { _id: identifier }
        : { name: identifier })
      .exec();
    if(!training) throw new NotFoundException("Training not found");
    const player = await this.userModel.findOne({_id: req['user']?.sub});
    if(!player) throw new NotFoundException("Player not found");
    const enrollment = await this.enrollmentModel.findOne({training: training._id, player: player._id})
    if(enrollment) throw new ConflictException("You already joined this training.")
    try {
      const newEnrollment = {
        training: training,
        player: player,
        enrollDateTime: new Date()
      };
      const createdEnrollment = new this.enrollmentModel(newEnrollment);
      await createdEnrollment.save();

      const res = await this.neo4jService.write('MATCH (u:User {email: $playerEmail}) MATCH (t:Training {name: $trainingName}) MERGE (u)-[role:PLAYED]->(t)', {
        playerEmail: player.email,
        trainingName: training.name
      });
      
      return createdEnrollment as IEnrollment;

    } catch (error:any) {
      Logger.error('Unexpected Error:', error);
      throw new BadRequestException(error.message);
    }
  }

  async leave(identifier: string, req: any): Promise<void> {
    Logger.log('leave', this.TAG);
    const isObjectId = mongoose.Types.ObjectId.isValid(identifier);
    const training = await this.trainingModel
      .findOne(isObjectId
        ? { _id: identifier }
        : { name: identifier })
      .exec();
    if(!training) throw new NotFoundException("Training not found");
    const player = await this.userModel.findOne({_id: req['user']?.sub});
    if(!player) throw new NotFoundException("Player not found");
    const enrollment = await this.enrollmentModel.findOne({training: training._id, player: player._id})
    if (!enrollment) throw new NotFoundException(`Enrollment could not be found!`);
    try {
      const result = await this.enrollmentModel
        .deleteOne({ _id: enrollment._id })
        .exec();
        const res = await this.neo4jService.write('MATCH (u:User {email: $userEmail}) -[r:PLAYED]->(t:Training {name: $trainingName}) DELETE r', {
          userEmail: player.email,
          trainingName: training.name,
        });
      Logger.log(`Enrollment deleted successfully`, this.TAG);
    } catch (error:any) {
      Logger.error('Unexpected Error:', error);
      throw new BadRequestException(error.message);
    }
  }
  
  async getEnrollmentsByTraining(identifier: string, req: any): Promise<IEnrollment[]> {
    Logger.log('get Enrollments by training', this.TAG);
    const isObjectId = mongoose.Types.ObjectId.isValid(identifier);
    const training = await this.trainingModel
      .findOne(isObjectId
        ? { _id: identifier }
        : { name: identifier })
      .exec();
    if(!training) throw new NotFoundException("Training not found");
    try {
      const result = await this.enrollmentModel.find({training: training._id});
      return result;
    } catch (error:any) {
      Logger.error('Unexpected Error:', error);
      throw new BadRequestException(error.message);
    }
  }
}
