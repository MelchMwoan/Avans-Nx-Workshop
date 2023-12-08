/* eslint-disable @typescript-eslint/no-unused-vars */
import * as bcrypt from 'bcrypt';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { IPlayer, ITrainer } from '@avans-nx-workshop/shared/api';
import { BehaviorSubject } from 'rxjs';
import { Logger } from '@nestjs/common';
import {
  CreatePlayerDto,
  CreateTrainerDto,
  CreateUserDto,
  UpdatePlayerDto,
  UpdateTrainerDto,
  UpdateUserDto,
} from '@avans-nx-workshop/backend/dto';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { User } from './user.schema';
import { Neo4jService } from 'nest-neo4j/dist';

@Injectable()
export class UserService {
  TAG = 'UserService';

  constructor(@InjectModel(User.name) private userModel: Model<User>, private readonly neo4jService: Neo4jService) {}

  async getAll(): Promise<(IPlayer | ITrainer)[]> {
    Logger.log('getAll', this.TAG);
    return (await this.userModel.find().exec()).map((userFromDb) => {
      return userFromDb as IPlayer | ITrainer;
    });
  }

  async getOne(identifier: string): Promise<IPlayer | ITrainer> {
    Logger.log(`getOne(${identifier})`, this.TAG);
    const isObjectId = mongoose.Types.ObjectId.isValid(identifier);
    const user = await this.userModel
      .findOne(isObjectId
        ? { _id: identifier }
        : { email: identifier })
      .exec();
    if (!user) {
      throw new NotFoundException(`User could not be found!`);
    }
    return user as IPlayer | ITrainer;
  }

  async delete(identifier: string, req: any): Promise<void> {
    Logger.log(`Delete(${identifier})`, this.TAG);
    try {
      const user = await this.userModel.findOne({ email: identifier })
      if (!user) throw new NotFoundException(`User could not be found!`);
      if(req['user'].email != user?.email) throw new UnauthorizedException("You are not the owner of this entity");
      const result = await this.userModel
        .deleteOne({ email: identifier })
        .exec();
        
      const res = await this.neo4jService.write('MATCH (u1:User {email: $userEmail}) DELETE u1', {
        userEmail: identifier
      });
      Logger.log(`User deleted successfully`, this.TAG);
    } catch (error) {
      Logger.error(`Error deleting user: ${error}`, this.TAG);
      throw error;
    }
  }

  async create(user: CreateUserDto): Promise<IPlayer | ITrainer> {
    Logger.log('create', this.TAG);
    const existingUser = await this.userModel.findOne({
      $or: [{ email: user.player?.email }, { email: user.trainer?.email }],
    });
    if (existingUser) {
      Logger.warn('Duplicate user', this.TAG);
      throw new ConflictException('User with this email already exists');
    }
    let newUser: CreatePlayerDto | CreateTrainerDto;
    if (user.userType == 'player' && user.player) {
      newUser = user.player;
    } else if (user.userType == 'trainer' && user.trainer) {
      newUser = user.trainer;
    } else {
      let errorMessage = 'Invalid user type.';
      if (user.userType !== 'player' && user.userType !== 'trainer') {
        errorMessage += ' User type must be either "player" or "trainer".';
      }
      if (user.userType === 'player' && !user.player) {
        errorMessage += ' Player details are required for user type "player".';
      }
      if (user.userType === 'trainer' && !user.trainer) {
        errorMessage +=
          ' Trainer details are required for user type "trainer".';
      }
      throw new BadRequestException(errorMessage);
    }
    newUser.password = await this.generateHashedPassword(newUser.password!);
    const createdUser = new this.userModel(newUser);
    createdUser.save();

    const res = await this.neo4jService.write('MERGE (u1:User {email: $userEmail}) ON CREATE SET u1.id = $userId, u1.name = $userName', {
      userId: String(createdUser._id),
      userEmail: createdUser.email,
      userName: createdUser.firstName + " " + createdUser.lastName
    });

    return createdUser as ITrainer | IPlayer;
  }

  async update(identifier: string, user: UpdateUserDto, req: any): Promise<IPlayer | ITrainer> {
    Logger.log('update', this.TAG);
    try {
        const existingUser = await this.userModel.findOne({ email: identifier});
        if (!existingUser) {
            Logger.warn('User not found', this.TAG);
            throw new NotFoundException('User was not found');
        }
        if(req['user'].email != existingUser.email) throw new UnauthorizedException("You are not the owner of this entity");
        let updatedUser: IPlayer | ITrainer;
        if (user.userType === 'player' && user.player) {
            existingUser.set({
                ...existingUser.toObject() as IPlayer,
                loan: undefined,
                ...user.player,
            });
            if (
                existingUser.NTTBnumber == null ||
                existingUser.rating == null ||
                existingUser.playsCompetition == null
            ) {
              throw new BadRequestException(
                'Not all required player properties are present'
              );
            }

            updatedUser = await existingUser.save() as IPlayer;
        } else if (user.userType === 'trainer' && user.trainer) {
            existingUser.set({
                ...existingUser.toObject() as ITrainer,
                NTTBnumber: undefined,
                rating: undefined,
                playsCompetition: undefined,
                ...user.trainer,
            });

            if (existingUser.loan == null) {
                throw new BadRequestException(
                  'Not all required trainer properties are present'
                );
              }
            updatedUser = await existingUser.save() as IPlayer;
        } else {
            throw new BadRequestException('Invalid user type or missing details.');
        }

        return updatedUser as IPlayer | ITrainer;
    } catch (error) {
        Logger.error(`Error updating user: ${error}`, this.TAG);
        throw error;
    }
  }

  async generateHashedPassword(plainTextPassword: string): Promise<string> {
    const saltOrRounds = 10;
    return await bcrypt.hash(plainTextPassword, saltOrRounds);
  }

  async validatePassword(
    givenPassword: string,
    passwordHash: string
  ): Promise<boolean> {
    return await bcrypt.compare(givenPassword, passwordHash);
  }
}
