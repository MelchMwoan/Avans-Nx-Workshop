/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { IRoom } from '@avans-nx-workshop/shared/api';
import { Logger } from '@nestjs/common';
import {
  CreateRoomDto,
  UpdateRoomDto,
} from '@avans-nx-workshop/backend/dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Room } from './room.schema';

@Injectable()
export class RoomService {
  TAG = 'RoomService';

  constructor(@InjectModel(Room.name) private roomModel: Model<Room>) {}

  async getAll(): Promise<IRoom[]> {
    Logger.log('getAll', this.TAG);
    return (await this.roomModel.find().exec()).map((roomsFromDb) => {
      return roomsFromDb as IRoom;
    });
  }

  async getOne(identifier: string): Promise<IRoom> {
    Logger.log(`getOne(${identifier})`, this.TAG);
    const room = await this.roomModel
      .findOne({ $or: [{ name: identifier }] })
      .exec();
    if (!room) {
      throw new NotFoundException(`Room could not be found!`);
    }
    return room as IRoom;
  }

  async delete(identifier: string, req: any): Promise<void> {
    //TODO: Authentication
    Logger.log(`Delete(${identifier})`, this.TAG);
    try {
      const room = await this.roomModel.findOne({ name: identifier })
      if (!room) throw new NotFoundException(`Room could not be found!`);
      // if(req['user'].email != user?.email) throw new UnauthorizedException("You are not the owner of this entity");
      const result = await this.roomModel
        .deleteOne({ name: identifier })
        .exec();
      Logger.log(`Room deleted successfully`, this.TAG);
    } catch (error) {
      Logger.error(`Error deleting room: ${error}`, this.TAG);
      throw error;
    }
  }

  async create(room: CreateRoomDto): Promise<IRoom> {
    Logger.log('create', this.TAG);
    const existingRoom = await this.roomModel.findOne({ name: room.name });
    if (existingRoom) {
      Logger.warn('Duplicate room', this.TAG);
      throw new ConflictException('Room with this name already exists');
    }
    const newRoom = room;
    const createdRoom = new this.roomModel(newRoom);
    createdRoom.save();
    return createdRoom as IRoom;
  }

  async update(identifier: string, room: UpdateRoomDto, req: any): Promise<IRoom> {
    Logger.log('update', this.TAG);
    try {
        const existingRoom = await this.roomModel.findOne({ name: identifier});
        if (!existingRoom) {
            Logger.warn('Room not found', this.TAG);
            throw new NotFoundException('Room was not found');
        }
        // if(req['user'].email != existingUser.email) throw new UnauthorizedException("You are not the owner of this entity");
        
        existingRoom.set({
          ...existingRoom.toObject() as IRoom,
          ...room,
      });
        const updatedRoom = await existingRoom.save();
        return updatedRoom as IRoom;
    } catch (error) {
        Logger.error(`Error updating room: ${error}`, this.TAG);
        if((error as Error).message.includes("E11000")) {
          throw new ConflictException('Room with this name already exists');
        }
        throw error;
    }
  }
}
