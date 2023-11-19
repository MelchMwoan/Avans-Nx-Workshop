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
    ICreateUser,
    IUpdateUser,
    IUpsertUser,
} from '@avans-nx-workshop/shared/api';

/**
 * Use the `Pick` utility type to extract only the properties we want for
 * new to-do items
 */
class CreatePlayerDto implements ICreateUser {
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

class CreateTrainerDto implements ICreateUser {
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

export class CreateUserDto implements ICreateUser {
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
    id!: string;

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

export class UpdateUserDto implements IUpdateUser {
    @IsString()
    @IsOptional()
    @IsNotEmpty()
    firstName!: string;

    @IsString()
    @IsOptional()
    @IsNotEmpty()
    lastName!: string;

    @IsString()
    @IsOptional()
    @IsNotEmpty()
    email!: string;
    
    @IsString()
    @IsOptional()
    @IsNotEmpty()
    telephone!: string;

    @IsString()
    @IsOptional()
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
