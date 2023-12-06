import {
    IsNotEmpty,
    IsString,
    IsOptional,
    IsEnum,
    IsDate,
    IsNumber,
    IsObject,
    IsArray,
    ValidateNested} from 'class-validator';
import {
    Difficulty, ICreateTraining, IExercise, IRoom, ITrainer, IUpdateTraining, IUpsertTraining, IUser,
} from '@avans-nx-workshop/shared/api';
import { ObjectId } from 'mongoose';

/**
 * Use the `Pick` utility type to extract only the properties we want for
 * new to-do items
 */
export class CreateTrainingDto implements ICreateTraining {
    @IsString()
    @IsNotEmpty()
    name!: string;

    @IsString()
    @IsNotEmpty()
    description!: string;
    
    @IsEnum(Difficulty)
    @IsNotEmpty()
    difficulty!: Difficulty;
    
    @IsNotEmpty()
    dateTime!: Date;
    
    @IsNumber()
    @IsNotEmpty()
    minPlayers!: number;
    
    @IsString()
    @IsNotEmpty()
    roomId!: string;
    
    @IsArray()
    @IsNotEmpty()
    @IsOptional()
    exercises!: string[];
    
    @IsArray()
    @IsNotEmpty()
    @IsOptional()
    trainers!: string[];

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    room?: string;
}

export class UpsertTrainingDto implements IUpsertTraining {
    @IsString()
    @IsNotEmpty()
    _id!: string;

    @IsString()
    @IsNotEmpty()
    name!: string;
    
    @IsString()
    @IsNotEmpty()
    description!: string;
    
    @IsEnum(Difficulty)
    @IsNotEmpty()
    difficulty!: Difficulty;
    
    @IsDate()
    @IsNotEmpty()
    dateTime!: Date;
    
    @IsNumber()
    @IsNotEmpty()
    minPlayers!: number;
    
    @IsObject()
    @IsNotEmpty()
    room!: IRoom;
    
    @IsArray()
    @IsNotEmpty()
    @ValidateNested({ each: true})
    trainers!: ITrainer[];
    
    @IsArray()
    @IsNotEmpty()
    @ValidateNested({ each: true})
    exercises!: IExercise[];
}

export class UpdateTrainingDto implements IUpdateTraining {
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    name!: string;

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    description!: string;
    
    @IsEnum(Difficulty)
    @IsNotEmpty()
    @IsOptional()
    difficulty!: Difficulty;

    @IsNotEmpty()
    @IsOptional()
    dateTime!: Date;
    
    @IsNumber()
    @IsNotEmpty()
    @IsOptional()
    minPlayers!: number;
    
    @IsString()
    @IsNotEmpty()
    roomId!: string;
    
    @IsArray()
    @IsNotEmpty()
    @IsOptional()
    trainers!: string[];
    
    @IsArray()
    @IsNotEmpty()
    @IsOptional()
    exercises!: string[];
}
