import {
    IsNotEmpty,
    IsString,
    IsBoolean,
    IsOptional,
    IsDate
} from 'class-validator';
import {
    ICreateUser,
    IUpdateUser,
    IUpsertUser,
} from '@avans-nx-workshop/shared/api';

/**
 * Use the `Pick` utility type to extract only the properties we want for
 * new to-do items
 */
export class CreateUserDto implements ICreateUser {
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
}
