import {
    IsNotEmpty,
    IsString,
    IsBoolean,
    IsOptional,
    IsNumber} from 'class-validator';
import {
    ICreateRoom,
    IUpdateRoom,
    IUpsertRoom,
} from '@avans-nx-workshop/shared/api';

/**
 * Use the `Pick` utility type to extract only the properties we want for
 * new to-do items
 */
export class CreateRoomDto implements ICreateRoom {
    @IsString()
    @IsNotEmpty()
    name!: string;

    @IsNumber()
    @IsNotEmpty()
    maxAmountOfTables!: number;
    
    @IsBoolean()
    @IsOptional()
    isInMaintenance = false;
}

export class UpsertRoomDto implements IUpsertRoom {
    @IsString()
    @IsNotEmpty()
    _id!: string;

    @IsString()
    @IsNotEmpty()
    name!: string;

    @IsNumber()
    @IsNotEmpty()
    maxAmountOfTables!: number;
    
    @IsBoolean()
    @IsOptional()
    isInMaintenance!: boolean;
}

export class UpdateRoomDto implements IUpdateRoom {
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    name?: string;

    @IsNumber()
    @IsNotEmpty()
    @IsOptional()
    maxAmountOfTables?: number;
    
    @IsBoolean()
    @IsOptional()
    isInMaintenance?: boolean;

}
