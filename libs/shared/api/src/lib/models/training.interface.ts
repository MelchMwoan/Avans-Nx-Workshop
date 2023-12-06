import { Id } from './id.type';
import { Difficulty, IExercise } from './exercise.interface';
import { IRoom } from './room.interface';
import { IUser } from './user.interface';

export interface ITraining {
    _id: Id;
    name: string;
    dateTime: Date
    description: string;
    minPlayers: number;
    difficulty: Difficulty;
    trainers: IUser[]
    room: IRoom;
    exercises: IExercise[];
}

export type ICreateTraining = Pick<ITraining, 'name' | 'description' | 'difficulty' | 'dateTime' | 'minPlayers'> & { roomId: string; };
export type IUpdateTraining = Partial<Omit<ITraining, 'id' | 'trainers' | 'exercises'>> & { roomId: string; };
export type IUpsertTraining = ITraining;
