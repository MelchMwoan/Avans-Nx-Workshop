import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { map, catchError, tap } from 'rxjs/operators';
import { ApiResponse, IUser } from '@avans-nx-workshop/shared/api';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

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
    endpoint = 'http://localhost:3000/api/user';

    constructor(private readonly http: HttpClient, private router: Router) {}

    /**
     * Get all items.
     *
     * @options options - optional URL queryparam options
     */
    public list(options?: any): Observable<IUser[] | null> {
        console.log(`list ${this.endpoint}`);

        return this.http
            .get<ApiResponse<IUser[]>>(this.endpoint, {
                ...options,
                ...httpOptions,
            })
            .pipe(
                map((response: any) => response.results as IUser[]),
                tap(console.log),
                catchError((error) => this.handleError(error, this.router))
            );
    }

    /**
     * Get a single item from the service.
     *
     */
    public read(id: string | null, options?: any): Observable<IUser> {
        console.log(`read ${this.endpoint}`);
        return this.http
            .get<ApiResponse<IUser>>(this.endpoint + '/' + id, {
                ...options,
                ...httpOptions,
            })
            .pipe(
                tap(console.log),
                map((response: any) => response.results as IUser),
                catchError((error) => this.handleError(error, this.router))
            );
    }

    /**
     * Handle errors.
     */
    public handleError(error: HttpErrorResponse, router: Router): Observable<any> {
        console.log('handleError in UserService', error);
        
    if (error.status === 404) {
        // Redirect to users page if resource not found
        this.router.navigate(['/users']);
    }
        return throwError(() => new Error(error.message));
    }
}
