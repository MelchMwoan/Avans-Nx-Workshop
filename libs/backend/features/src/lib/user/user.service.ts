import { Injectable, NotFoundException } from '@nestjs/common';
import { IUser } from '@avans-nx-workshop/shared/api';
import { BehaviorSubject } from 'rxjs';
import { Logger } from '@nestjs/common';

@Injectable()
export class UserService {
    TAG = 'UserService';

    private users$ = new BehaviorSubject<IUser[]>([
        {
            id: '0',
            firstName: 'Melchior',
            lastName: 'Willenborg',
            email: 'mw@test.nl',
            telephone: '06-12345678',
            birthDate: new Date('06-08-2004'),
            password: ''
        },
        {
            id: '1',
            firstName: 'Henk',
            lastName: 'Hoogerheiden',
            email: 'hh@test.nl',
            telephone: '06-11122233',
            birthDate: new Date('12-10-2002'),
            password: ''
        },
        {
            id: '2',
            firstName: 'Jan',
            lastName: 'Hoogerheiden',
            email: 'jh@test.nl',
            telephone: '06-87654321',
            birthDate: new Date('21-02-1998'),
            password: ''
        },
        {
            id: '3',
            firstName: 'Paas',
            lastName: 'Haas',
            email: 'ph@test.nl',
            telephone: '06-12332112',
            birthDate: new Date('08-08-2008'),
            password: ''
        },
        {
            id: '4',
            firstName: 'Pieter',
            lastName: 'Klaassen',
            email: 'pk@test.nl',
            telephone: '06-99988877',
            birthDate: new Date('09-08-2007'),
            password: ''
        },
    ]);

    getAll(): IUser[] {
        Logger.log('getAll', this.TAG);
        return this.users$.value;
    }

    getOne(id: string): IUser {
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
    create(user: Pick<IUser, 'firstName' | 'telephone' | 'lastName' | 'email' | 'birthDate'>): IUser {
        Logger.log('create', this.TAG);
        const current = this.users$.value;
        // Use the incoming data, a randomized ID, and a default value of `false` to create the new to-do
        const newUser: IUser = {
            ...user,
            password: '',
            id: `user-${Math.floor(Math.random() * 10000)}`,
        };
        this.users$.next([...current, newUser]);
        return newUser;
    }

    update(id: string, user: Pick<IUser, 'firstName' | 'telephone' | 'lastName' | 'email' | 'birthDate'>): IUser {
        Logger.log('update', this.TAG);
        const index = this.users$.value.findIndex((td) => td.id === id);
        if(index !== -1) {
            const newUser: IUser = {
                ...this.users$.value[index],
                ...user,
                id: id
            };
            this.users$.value[index] = newUser;
            return newUser;
        } else {
            throw new NotFoundException("User was not found");
        }
    }
}
