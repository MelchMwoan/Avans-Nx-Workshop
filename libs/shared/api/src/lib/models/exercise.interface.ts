import { Id } from './id.type';
import { ITrainer } from './user.interface';

export enum Difficulty {
    Basic = 'Basis',
    Advanced = 'Gevorderd',
    Expert = 'Expert',
    YouthBasic = 'Jeugd Basis',
    YouthExpert = 'Jeugd Selectie'
}

export interface IExercise {
    _id: Id;
    name: string;
    description: string;
    difficulty: Difficulty;
    owner: ITrainer;
}

export type ICreateExercise = Pick<IExercise, 'name' | 'description' | 'difficulty'>;
export type IUpdateExercise = Partial<Omit<IExercise, 'id' | 'owner'>>;
export type IUpsertExercise = IExercise;
