import { Id } from './id.type';
import { IPlayer } from './user.interface';
import { ITraining } from './training.interface';

export interface IEnrollment {
    _id: Id;
    enrollDateTime: Date;
    player: IPlayer;
    training: ITraining;
}

export type ICreateEnrollment = Partial<IEnrollment> & { playerId: string, trainingId: string; };
export type IUpdateEnrollment = Partial<Omit<IEnrollment, 'id'>> & { playerId: string, trainingId: string; };
export type IUpsertEnrollment = IEnrollment;
