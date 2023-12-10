import { Id } from './id.type';
import { ITrainer } from './user.interface';

export interface IRoom {
    _id: Id;
    name: string;
    maxAmountOfTables: number;
    isInMaintenance: boolean;
    owner: ITrainer;
}

export type ICreateRoom = Pick<IRoom, 'name' | 'maxAmountOfTables' | 'isInMaintenance'>;
export type IUpdateRoom = Partial<Omit<IRoom, 'id'>>;
export type IUpsertRoom = IRoom;
