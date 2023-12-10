import { Id } from './id.type';
import { ITrainer } from './user.interface';

// Voor nu is onze user een string; later zullen we hier een User object van maken.
//TODO: implement password through authentication
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
