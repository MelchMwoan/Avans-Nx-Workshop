import { Id } from './id.type';

// Voor nu is onze user een string; later zullen we hier een User object van maken.
export interface IUser {
    id: Id;
    firstName: string;
    lastName: string;
    email: string;
    telephone: string;
    birthDate: Date;
}

export type ICreateUser = Pick<
    IUser,
    'firstName' | 'lastName' | 'email' | 'birthDate'
>;
export type IUpdateUser = Partial<Omit<IUser, 'id'>>;
export type IUpsertUser = IUser;
