import {
    IsNotEmpty,
    IsString,
    IsOptional,
    IsEnum,
    IsObject} from 'class-validator';
import {
    Difficulty,
    ICreateExercise,
    ITrainer,
    IUpdateExercise,
    IUpsertExercise,
} from '@avans-nx-workshop/shared/api';

/**
 * Use the `Pick` utility type to extract only the properties we want for
 * new to-do items
 */
export class CreateExerciseDto implements ICreateExercise {
    @IsString()
    @IsNotEmpty()
    name!: string;

    @IsString()
    @IsNotEmpty()
    description!: string;

    @IsEnum(Difficulty)
    @IsNotEmpty()
    difficulty!: Difficulty;

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    owner?: ITrainer;
}

export class UpsertExerciseDto implements IUpsertExercise {
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
    
    @IsObject()
    @IsNotEmpty()
    owner!: ITrainer;
}

export class UpdateExerciseDto implements IUpdateExercise {
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
}
