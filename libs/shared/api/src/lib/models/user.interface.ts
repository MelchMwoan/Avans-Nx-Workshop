import { Id } from './id.type';
export interface IUser {
    _id: Id;
    firstName: string;
    lastName: string;
    email: string;
    telephone: string;
    birthDate: Date;
    password?: string;
    token?: string;
}

export interface IPlayer extends IUser{
    rating: number;
    playsCompetition: boolean;
    NTTBnumber: number;
}

export interface ITrainer extends IUser{
    loan: number;
}

export type ICreatePlayer = Pick<IPlayer, 'firstName' | 'lastName' | 'email' | 'birthDate' | 'password' | 'rating' | 'NTTBnumber' | 'playsCompetition'>;
export type ICreateTrainer = Pick<ITrainer, 'firstName' | 'lastName' | 'email' | 'birthDate' | 'password' | 'loan'>;
export type ICreateUser = ICreatePlayer | ICreateTrainer;
export type IUpdatePlayer = Partial<Omit<IPlayer, 'id'>>;
export type IUpdateTrainer = Partial<Omit<ITrainer, 'id'>>;
export type IUpdateUser = IUpdatePlayer | IUpdateTrainer;
export type IUpsertUser = IUser;
