import {
    IsNotEmpty,
    IsString,
    IsOptional,
    IsEnum,
    IsDate,
    IsNumber,
    IsObject,
    IsArray} from 'class-validator';
import {
    Difficulty, ICreateTraining, IExercise, IRoom, ITrainer, IUpdateTraining, IUpsertTraining,
} from '@avans-nx-workshop/shared/api';
import { IEnrollment } from '@avans-nx-workshop/shared/api';

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
    trainers!: ITrainer[];
    
    @IsArray()
    @IsNotEmpty()
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
    @IsOptional()
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
