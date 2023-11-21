/* eslint-disable @typescript-eslint/no-unused-vars */
import * as bcrypt from 'bcrypt';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { IPlayer, ITrainer } from '@avans-nx-workshop/shared/api';
import { BehaviorSubject } from 'rxjs';
import { Logger } from '@nestjs/common';
import { CreatePlayerDto, CreateTrainerDto, CreateUserDto, UpdatePlayerDto, UpdateTrainerDto, UpdateUserDto } from '@avans-nx-workshop/backend/dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.schema';

@Injectable()
export class UserService {
    TAG = 'UserService';

    constructor(@InjectModel(User.name) private userModel: Model<User>) {}

    private users$ = new BehaviorSubject<( IPlayer | ITrainer)[]>([
        {
            _id: 0,
            firstName: 'Melchior',
            lastName: 'Willenborg',
            email: 'mw@test.nl',
            telephone: '06-12345678',
            birthDate: new Date('06-08-2004'),
            password: '',
            loan: 0
        },
        {
            _id: 1,
            firstName: 'Henk',
            lastName: 'Hoogerheiden',
            email: 'hh@test.nl',
            telephone: '06-11122233',
            birthDate: new Date('12-10-2002'),
            password: 'Test123!',
            playsCompetition: true,
            NTTBnumber: 1,
            rating: 3
        },
        {
            _id: 2,
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
            _id: 3,
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
            _id: 4,
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
        Logger.log(`users$: ${JSON.stringify(this.users$.value)}`, this.TAG);
        return this.users$.value;
    }

    getOne(identifier: string): IPlayer | ITrainer {
        Logger.log(`getOne(${identifier})`, this.TAG);
        console.log(identifier) 
        const user = this.users$.value.find((td) => td._id == parseInt(identifier) || td.email == identifier);
        console.log(user)
        if (!user) {
            throw new NotFoundException(`User could not be found!`);
        }
        return user;
    }

    delete(id: number): void {
        Logger.log(`Delete(${id})`, this.TAG);
        const userIndex = this.users$.value.findIndex((td) => td._id === id);

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
    async create(user: CreateUserDto): Promise<IPlayer | ITrainer> {
        Logger.log('create', this.TAG);
        const current = this.users$.value;
        // TODO: implement database
        if(user.userType == 'player' && user.player) {
            const newPlayer: CreatePlayerDto = user.player;
            newPlayer.password = await this.generateHashedPassword(newPlayer.password!);
            const createdUser = new this.userModel(newPlayer);
            createdUser.save();
            // this.users$.next([...current, newPlayer]);
            return newPlayer as IPlayer;
        } else if(user.userType == 'trainer' && user.trainer) {
            // const createdUser = new this.userModel(user.trainer);
            // createdUser.save();
            const newTrainer: CreateTrainerDto = user.trainer;
            const newUser: ITrainer = {
                _id: Math.floor(Math.random() * 10000),
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

    update(id: number, user: UpdateUserDto): IPlayer | ITrainer {
        Logger.log('update', this.TAG);
        const index = this.users$.value.findIndex((td) => td._id === id);
        if(index !== -1) {
            if(user.userType == 'player' && user.player) {
                const {loan, ...filteredPlayer} = this.users$.value[index] as ITrainer;
                const newUser: IPlayer = {
                    ...filteredPlayer as IPlayer,
                    ...user.player,
                    _id: id
                };
                if(newUser.NTTBnumber == null || newUser.rating == null || newUser.playsCompetition == null) {throw new BadRequestException("Not all required player properties are present");}
                this.users$.value[index] = newUser;
                return newUser;
            } else if (user.userType === 'trainer' && user.trainer) {
                const {NTTBnumber, rating, playsCompetition, ...filteredPlayer} = this.users$.value[index] as IPlayer;
                const newUser: ITrainer = {
                    ...filteredPlayer as ITrainer,
                    ...user.trainer,
                    _id: id
                };
                if(newUser.loan == null) {throw new BadRequestException("Not all required trainer properties are present");}
                this.users$.value[index] = newUser;
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
        } else {
            throw new NotFoundException("User was not found");
        }
    }

    async generateHashedPassword(plainTextPassword: string): Promise<string> {
        const saltOrRounds = 10;
        return await bcrypt.hash(plainTextPassword, saltOrRounds);
    }

    async validatePassword(givenPassword: string, passwordHash: string): Promise<boolean> {
        return await bcrypt.compare(givenPassword, passwordHash);
    }
}
