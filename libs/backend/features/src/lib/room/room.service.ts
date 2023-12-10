/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { IRoom } from '@avans-nx-workshop/shared/api';
import { Logger } from '@nestjs/common';
import {
  CreateRoomDto,
  UpdateRoomDto,
} from '@avans-nx-workshop/backend/dto';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Room } from './room.schema';
import { Neo4jService } from 'nest-neo4j/dist';

@Injectable()
export class RoomService {
  TAG = 'RoomService';

  constructor(@InjectModel(Room.name) private roomModel: Model<Room>, private readonly neo4jService: Neo4jService) {}

  async getAll(): Promise<IRoom[]> {
    Logger.log('getAll', this.TAG);
    return (await this.roomModel.find().exec()).map((roomsFromDb) => {
      return roomsFromDb as unknown as IRoom;
    });
  }

  async getOne(identifier: string): Promise<IRoom> {
    Logger.log(`getOne(${identifier})`, this.TAG);
    const isObjectId = mongoose.Types.ObjectId.isValid(identifier);
    const room = await this.roomModel
      .findOne(isObjectId
        ? { _id: identifier }
        : { name: identifier })
      .exec();
    if (!room) {
      throw new NotFoundException(`Room could not be found!`);
    }
    return room as unknown as IRoom;
  }

  async delete(identifier: string, req: any): Promise<void> {
    //TODO: dont delete when relationships exist
    Logger.log(`Delete(${identifier})`, this.TAG);
    try {
      const room = await this.roomModel.findOne({ name: identifier })
      if (!room) throw new NotFoundException(`Room could not be found!`);
      if(req['user'].sub != room.owner) throw new UnauthorizedException("You are not the owner of this entity");
      const result = await this.roomModel
        .deleteOne({ name: identifier })
        .exec();
        const res = await this.neo4jService.write('MATCH (r:Room {name: $roomName}) OPTIONAL MATCH (r)-[x]-() DELETE r,x', {
          roomName: identifier
        });
      Logger.log(`Room deleted successfully`, this.TAG);
    } catch (error) {
      Logger.error(`Error deleting room: ${error}`, this.TAG);
      throw error;
    }
  }

  async create(room: CreateRoomDto, req: any): Promise<IRoom> {
    Logger.log('create', this.TAG);
    const existingRoom = await this.roomModel.findOne({ name: room.name });
    if (existingRoom) {
      Logger.warn('Duplicate room', this.TAG);
      throw new ConflictException('Room with this name already exists');
    }
    room.owner = req.user.sub;
    const newRoom = room;
    const createdRoom = new this.roomModel(newRoom);
    createdRoom.save();
    const res = await this.neo4jService.write('MERGE (r:Room {name: $roomName}) ON CREATE SET r.id = $roomId WITH r MATCH (u:User {id:$userId}) MERGE (u)-[role:CREATED]->(r)', {
      roomId: String(createdRoom._id),
      roomName: createdRoom.name,
      userId: String(createdRoom.owner)
    });
    return createdRoom as unknown as IRoom;
  }

  async update(identifier: string, room: UpdateRoomDto, req: any): Promise<IRoom> {
    Logger.log('update', this.TAG);
    try {
        const existingRoom = await this.roomModel.findOne({ name: identifier});
        if (!existingRoom) {
            Logger.warn('Room not found', this.TAG);
            throw new NotFoundException('Room was not found');
        }
        const oldName = existingRoom.name;
        if(req['user'].sub != existingRoom.owner) throw new UnauthorizedException("You are not the owner of this entity");
        
        existingRoom.set({
          ...existingRoom.toObject() as IRoom,
          ...room,
      });
        const updatedRoom = await existingRoom.save();
        const res = await this.neo4jService.write('MATCH(r:Room {name:$roomOldName}) SET r.name = $roomNewName', {
          roomOldName: oldName,
          roomNewName: updatedRoom.name,
        });
        return updatedRoom as unknown as IRoom;
    } catch (error) {
        Logger.error(`Error updating room: ${error}`, this.TAG);
        if((error as Error).message.includes("E11000")) {
          throw new ConflictException('Room with this name already exists');
        }
        throw error;
    }
  }
}
