import {
    IsNotEmpty,
    IsString,
    IsBoolean,
    IsOptional,
    IsDate,
    IsNumber,
    ValidateNested
} from 'class-validator';
import { Type } from 'class-transformer';
import {
    ICreatePlayer,
    ICreateTrainer,
    IUpdatePlayer,
    IUpdateTrainer,
    IUpsertUser,
} from '@avans-nx-workshop/shared/api';

/**
 * Use the `Pick` utility type to extract only the properties we want for
 * new to-do items
 */
export class CreatePlayerDto implements ICreatePlayer {
    @IsString()
    @IsNotEmpty()
    firstName!: string;

    @IsString()
    @IsNotEmpty()
    lastName!: string;

    @IsString()
    @IsNotEmpty()
    email!: string;
    
    @IsString()
    @IsNotEmpty()
    telephone!: string;

    @IsString()
    @IsNotEmpty()
    birthDate!: Date;

    @IsString()
    password!: string;

    // Additional properties for IPlayer
    @IsNumber()
    @IsNotEmpty()
    rating!: number;

    @IsNumber()
    @IsNotEmpty()
    NTTBnumber!: number;
    
    @IsBoolean()
    @IsNotEmpty()
    playsCompetition!: boolean;
}

export class CreateTrainerDto implements ICreateTrainer {
    @IsString()
    @IsNotEmpty()
    firstName!: string;

    @IsString()
    @IsNotEmpty()
    lastName!: string;

    @IsString()
    @IsNotEmpty()
    email!: string;
    
    @IsString()
    @IsNotEmpty()
    telephone!: string;

    @IsString()
    @IsNotEmpty()
    birthDate!: Date;

    @IsString()
    password!: string;

    // Additional properties for ITrainer
    @IsNumber()
    @IsNotEmpty()
    loan!: number;
}

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    userType!: 'player' | 'trainer';
  
    @ValidateNested()
    @Type(() => CreatePlayerDto)
    @IsOptional()
    player?: CreatePlayerDto;
  
    @ValidateNested()
    @Type(() => CreateTrainerDto)
    @IsOptional()
    trainer?: CreateTrainerDto;
  }

export class UpsertUserDto implements IUpsertUser {
    @IsString()
    @IsNotEmpty()
    firstName!: string;

    @IsString()
    @IsNotEmpty()
    lastName!: string;

    @IsString()
    @IsNotEmpty()
    email!: string;

    @IsString()
    @IsNotEmpty()
    telephone!: string;

    @IsString()
    @IsNotEmpty()
    _id!: string;

    @IsDate()
    @IsNotEmpty()
    birthDate!: Date;

    @IsString()
    password!: string;
    
    // Additional properties for IPlayer
    @IsNumber()
    @IsOptional()
    rating?: number;

    @IsNumber()
    @IsOptional()
    NTTBnumber?: number;
    
    @IsBoolean()
    @IsOptional()
    playsCompetition?: boolean;

    // Additional properties for ITrainer
    @IsNumber()
    @IsOptional()
    loan = 0;
}

export class UpdatePlayerDto implements IUpdatePlayer {
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    firstName!: string;

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    lastName!: string;

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    email!: string;
    
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    telephone!: string;

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    birthDate!: Date;

    @IsString()
    @IsOptional()
    password!: string;

    // Additional properties for IPlayer
    @IsNumber()
    @IsNotEmpty()
    @IsOptional()
    rating!: number;

    @IsNumber()
    @IsNotEmpty()
    @IsOptional()
    NTTBnumber!: number;
    
    @IsBoolean()
    @IsNotEmpty()
    @IsOptional()
    playsCompetition!: boolean;
}

export class UpdateTrainerDto implements IUpdateTrainer {
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    firstName!: string;

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    lastName!: string;

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    email!: string;
    
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    telephone!: string;

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    birthDate!: Date;

    @IsString()
    @IsOptional()
    password!: string;

    // Additional properties for ITrainer
    @IsNumber()
    @IsNotEmpty()
    @IsOptional()
    loan!: number;
}
export class UpdateUserDto {
    @IsString()
    @IsNotEmpty()
    userType!: 'player' | 'trainer';
  
    @ValidateNested()
    @Type(() => UpdatePlayerDto)
    @IsOptional()
    player?: UpdatePlayerDto;
  
    @ValidateNested()
    @Type(() => UpdateTrainerDto)
    @IsOptional()
    trainer?: UpdateTrainerDto;
}
