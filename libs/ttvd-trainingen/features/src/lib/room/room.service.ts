/* eslint-disable @typescript-eslint/no-explicit-any */
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { map, catchError, tap } from 'rxjs/operators';
import { ApiResponse, IRoom } from '@avans-nx-workshop/shared/api';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '@avans-nx-workshop/shared/util-env';
import { CreateRoomDto, UpdateRoomDto } from '@avans-nx-workshop/backend/dto';
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
export class RoomService {
    endpoint = environment.dataApiUrl + '/room';

    constructor(private readonly http: HttpClient, private router: Router, private authService: AuthService, private alertService: AlertService) {}

    /**
     * Get all items.
     *
     * @options options - optional URL queryparam options
     */
    public list(options?: any): Observable<IRoom[] | null> {
        console.log(`list ${this.endpoint}`);

        return this.http
            .get<ApiResponse<IRoom[]>>(this.endpoint, {
                ...options,
                ...httpOptions,
            })
            .pipe(
                map((response: any) => response.results as IRoom[]),
                tap(console.log),
                catchError((error) => this.handleError(error, this.router))
            );
    }

    /**
     * Get a single item from the service.
     *
     */
    public read(id: string | null, options?: any): Observable<IRoom> {
        console.log(`read ${this.endpoint}`);
        return this.http
            .get<ApiResponse<IRoom>>(this.endpoint + '/' + id, {
                ...options,
                ...httpOptions,
            })
            .pipe(
                tap(console.log),
                map((response: any) => response.results as IRoom),
                catchError((error) => this.handleError(error, this.router))
            );
    }

    public create(room: CreateRoomDto, options?: any) {
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
            .post<ApiResponse<IRoom>>(this.endpoint, room, {
                ...options,
                ...authOptions,
            })
            .pipe(
                tap(console.log),
                catchError((error) => this.handleError(error, this.router))
            )
    }

    public update(id: string, room: UpdateRoomDto, options?: any) {
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
        .put<ApiResponse<IRoom>>(this.endpoint + "/" + id, room, {
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
        console.log('handleError in RoomService', error);
        
        const errorResponse: Alert = {
            type: 'danger',
            message: error.error.message || error.message
        }
        if (error.status === 404) {
            errorResponse.dismissOnRouteChange = false;
            this.router.navigate(['/rooms']);
        }
        this.alertService.show(errorResponse.type, errorResponse.message, errorResponse.dismissOnRouteChange)
        return throwError(errorResponse);
    }
}
