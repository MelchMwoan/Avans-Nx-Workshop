import { Id } from './id.type';

export enum Difficulty {
    Basic = 'Basic',
    Advanced = 'Advanced',
    Expert = 'Expert',
    YouthBasic = 'Youth Basic',
    YouthExpert = 'Youth Expert'
}

export interface IExercise {
    id: Id;
    name: string;
    // dateTime: Date
    description: string;
    // minPlayers: number;
    difficulty: Difficulty;
}

export type ICreateExercise = Pick<IExercise, 'name' | 'description' | 'difficulty'>;
export type IUpdateExercise = Partial<Omit<IExercise, 'id'>>;
export type IUpsertExercise = IExercise;
