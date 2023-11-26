import {
    IsNotEmpty,
    IsString,
    IsOptional,
    IsEnum} from 'class-validator';
import {
    Difficulty,
    ICreateExercise,
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
}

export class UpsertExerciseDto implements IUpsertExercise {
    @IsString()
    @IsNotEmpty()
    id!: string;

    @IsString()
    @IsNotEmpty()
    name!: string;

    @IsString()
    @IsNotEmpty()
    description!: string;

    @IsEnum(Difficulty)
    @IsNotEmpty()
    difficulty!: Difficulty;
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
