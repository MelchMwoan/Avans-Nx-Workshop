import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { IPlayer, ITrainer } from '@avans-nx-workshop/shared/api';
import { BehaviorSubject } from 'rxjs';
import { Logger } from '@nestjs/common';
import { CreatePlayerDto, CreateTrainerDto, CreateUserDto } from '@avans-nx-workshop/backend/dto';

@Injectable()
export class UserService {
    TAG = 'UserService';

    private users$ = new BehaviorSubject<( IPlayer | ITrainer)[]>([
        {
            id: '0',
            firstName: 'Melchior',
            lastName: 'Willenborg',
            email: 'mw@test.nl',
            telephone: '06-12345678',
            birthDate: new Date('06-08-2004'),
            password: '',
            loan: 0
        },
        {
            id: '1',
            firstName: 'Henk',
            lastName: 'Hoogerheiden',
            email: 'hh@test.nl',
            telephone: '06-11122233',
            birthDate: new Date('12-10-2002'),
            password: '',
            playsCompetition: true,
            NTTBnumber: 1,
            rating: 3
        },
        {
            id: '2',
            firstName: 'Jan',
            lastName: 'Hoogerheiden',
            email: 'jh@test.nl',
            telephone: '06-87654321',
            birthDate: new Date('21-02-1998'),
            password: '',
            playsCompetition: false,
            NTTBnumber: 3,
            rating: 13
        },
        {
            id: '3',
            firstName: 'Paas',
            lastName: 'Haas',
            email: 'ph@test.nl',
            telephone: '06-12332112',
            birthDate: new Date('08-08-2008'),
            password: '',
            playsCompetition: true,
            NTTBnumber: 2,
            rating: 213
        },
        {
            id: '4',
            firstName: 'Pieter',
            lastName: 'Klaassen',
            email: 'pk@test.nl',
            telephone: '06-99988877',
            birthDate: new Date('09-08-2007'),
            password: '',
            loan: 0
        },
    ]);

    getAll(): (IPlayer | ITrainer)[] {
        Logger.log('getAll', this.TAG);
        return this.users$.value;
    }

    getOne(id: string): IPlayer | ITrainer {
        Logger.log(`getOne(${id})`, this.TAG);
        const user = this.users$.value.find((td) => td.id === id);
        if (!user) {
            throw new NotFoundException(`User could not be found!`);
        }
        return user;
    }

    delete(id: string): void {
        Logger.log(`Delete(${id})`, this.TAG);
        const userIndex = this.users$.value.findIndex((td) => td.id === id);

    if (userIndex === -1) {
        throw new NotFoundException(`User could not be found!`);
    }
        this.users$.value.splice(userIndex, 1);
    }

    /**
     * Update the arg signature to match the DTO, but keep the
     * return signature - we still want to respond with the complete
     * object
     */
    create(user: CreateUserDto): IPlayer | ITrainer {
        Logger.log('create', this.TAG);
        const current = this.users$.value;
        // Use the incoming data, a randomized ID, and a default value of `false` to create the new to-do
        if(user.userType == 'player' && user.player) {
            const newPlayer: CreatePlayerDto = user.player!;
            const newUser: IPlayer = {
                id: `user-${Math.floor(Math.random() * 10000)}`,
                ...newPlayer
            };
            this.users$.next([...current, newUser]);
            return newUser;
        } else if(user.userType == 'trainer' && user.trainer) {
            const newTrainer: CreateTrainerDto = user.trainer!;
            const newUser: ITrainer = {
                id: `user-${Math.floor(Math.random() * 10000)}`,
                ...newTrainer
            };
            this.users$.next([...current, newUser]);
            return newUser;
        } else {
            let errorMessage = 'Invalid user type.';
            if (user.userType !== 'player' && user.userType !== 'trainer') {
                errorMessage += ' User type must be either "player" or "trainer".';
            }
            if (user.userType === 'player' && !user.player) {
                errorMessage += ' Player details are required for user type "player".';
            }
            if (user.userType === 'trainer' && !user.trainer) {
                errorMessage += ' Trainer details are required for user type "trainer".';
            }
            throw new BadRequestException(errorMessage);

        }
    }

    update(id: string, user: Pick<IPlayer, 'firstName' | 'telephone' | 'lastName' | 'email' | 'birthDate'| 'rating' | 'NTTBnumber' | 'playsCompetition'> | Pick<ITrainer, 'firstName' | 'telephone' | 'lastName' | 'email' | 'birthDate' | 'loan'>): IPlayer | ITrainer {
        Logger.log('update', this.TAG);
        const index = this.users$.value.findIndex((td) => td.id === id);
        if(index !== -1) {
            if('rating' in user) {
                const newUser: IPlayer = {
                    ...this.users$.value[index] as IPlayer,
                    ...user,
                    id: id
                };
                this.users$.value[index] = newUser;
                return newUser;
            } else {
                const newUser: ITrainer = {
                    ...this.users$.value[index] as ITrainer,
                    ...user,
                    id: id
                };
                this.users$.value[index] = newUser;
                return newUser;
            }
        } else {
            throw new NotFoundException("User was not found");
        }
    }
}
