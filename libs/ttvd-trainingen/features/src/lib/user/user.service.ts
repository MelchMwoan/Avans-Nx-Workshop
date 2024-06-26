/* eslint-disable @typescript-eslint/no-explicit-any */
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { map, catchError, tap } from 'rxjs/operators';
import { ApiResponse, IPlayer, ITrainer } from '@avans-nx-workshop/shared/api';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '@avans-nx-workshop/shared/util-env';
import { CreateUserDto, UpdateUserDto } from '@avans-nx-workshop/backend/dto';
import { AuthService } from '../auth/auth.service';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { Alert, AlertService } from 'libs/ttvd-trainingen/ui/src/lib/alert/alert.service';

/**
 * See https://angular.io/guide/http#requesting-data-from-a-server
 */
export const httpOptions = {
    observe: 'body',
    responseType: 'json',
};

/**
 *
 *
 */
@Injectable()
export class UserService {
    endpoint = environment.dataApiUrl + '/user';

    constructor(private readonly http: HttpClient, private router: Router, private authService: AuthService, private alertService: AlertService) {}

    /**
     * Get all items.
     *
     * @options options - optional URL queryparam options
     */
    public list(options?: any): Observable<(IPlayer | ITrainer)[] | null> {
        console.log(`list ${this.endpoint}`);

        return this.http
            .get<ApiResponse<(IPlayer | ITrainer)[]>>(this.endpoint, {
                ...options,
                ...httpOptions,
            })
            .pipe(
                map((response: any) => response.results as (IPlayer | ITrainer)[]),
                tap(console.log),
                catchError((error) => this.handleError(error, this.router))
            );
    }

    /**
     * Get a single item from the service.
     *
     */
    public read(id: string | null, options?: any): Observable<(IPlayer | ITrainer)> {
        console.log(`read ${this.endpoint}`);
        return this.http
            .get<ApiResponse<(IPlayer | ITrainer)>>(this.endpoint + '/' + id, {
                ...options,
                ...httpOptions,
            })
            .pipe(
                tap(console.log),
                map((response: any) => response.results as (IPlayer | ITrainer)),
                catchError((error) => this.handleError(error, this.router))
            );
    }

    public create(user: CreateUserDto, options?: any) {
        return this.http
            .post<ApiResponse<(IPlayer | ITrainer)>>(this.endpoint, user, {
                ...options,
                ...httpOptions,
            })
            .pipe(
                tap(console.log),
                catchError((error) => this.handleError(error, this.router))
            )
    }

    public update(id: string, user: UpdateUserDto, options?: any) {
        console.log(`updating user`);
        const authOptions = {
            ...httpOptions,
            headers: new HttpHeaders({
                'Content-type': 'application/json',
            })
        }
        this.authService.getUserFromLocalStorage().subscribe((result) => {
             const accessToken = (result as any).results.access_token;
             authOptions.headers = authOptions.headers.set('Authorization', 'Bearer ' + accessToken);
        })
        return this.http
        .put<ApiResponse<(IPlayer | ITrainer)>>(this.endpoint + "/" + id, user, {
            ...options,
            ...authOptions,
        })
        .pipe(
            tap(console.log),
            catchError((error) => this.handleError(error, this.router))
        )
    }
    
    public delete(id: string | null, options?: any) {
        console.log(`deleting`)
        const authOptions = {
            ...httpOptions,
            headers: new HttpHeaders({
                'Content-type': 'application/json',
            })
        }
        this.authService.getUserFromLocalStorage().subscribe((result) => {
             const accessToken = (result as any).results.access_token;
             authOptions.headers = authOptions.headers.set('Authorization', 'Bearer ' + accessToken);
        })
        return this.http
            .delete<ApiResponse<any>>(this.endpoint + '/' + id, {
                ...options,
                ...authOptions,
            })
            .pipe(
                tap(console.log),
                catchError((error) => this.handleError(error, this.router))
            );
    }

    /**
     * Handle errors.
     */
    public handleError(error: HttpErrorResponse, router: Router): Observable<any> {
        console.log('handleError in UserService', error);
        
        const errorResponse: Alert = {
            type: 'danger',
            message: error.error.message || error.message
        }
        if (error.status === 404) {
            errorResponse.dismissOnRouteChange = false;
            this.router.navigate(['/users']);
        }
        this.alertService.show(errorResponse.type, errorResponse.message, errorResponse.dismissOnRouteChange)
        return throwError(errorResponse);
    }
}
