import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { IUser } from '@avans-nx-workshop/shared/api';
import { Router } from '@angular/router';
import { environment } from '@avans-nx-workshop/shared/util-env';
import { map, catchError, switchMap } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { Alert, AlertService } from 'libs/ttvd-trainingen/ui/src/lib/alert/alert.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public currentUser$ = new BehaviorSubject<IUser | undefined>(undefined);
  private readonly CURRENT_USER = 'currentuser';
  private readonly headers = new HttpHeaders({
    'Content-Type': 'application/json',
  });

  constructor(
    private http: HttpClient,
    private router: Router, private alertService: AlertService
  ) {
    // Check of we al een ingelogde user hebben
    // Zo ja, check dan op de backend of het token nog valid is.
    // Het token kan namelijk verlopen zijn. Indien verlopen
    // retourneren we meteen een nieuw token.
    this.getUserFromLocalStorage()
      .pipe(
        // switchMap is overbodig als we validateToken() niet gebruiken...
        switchMap((user: IUser) => {
          if (user) {
            console.log('User found in local storage');
            this.currentUser$.next(user);
            // return this.validateToken(user);
            return of(user);
          } else {
            console.log(`No current user found`);
            return of(undefined);
          }
        })
      )
      .subscribe(() => console.log('Startup auth done'));
  }

  login(email: string, password: string): Observable<IUser | undefined> {
    console.log(`login at ${environment.dataApiUrl}auth/login`);

    return this.http
      .post<IUser>(
        `${environment.dataApiUrl}/auth/login`,
        { email: email, password: password },
        { headers: this.headers }
      )
      .pipe(
        map((user) => {
          this.saveUserToLocalStorage(user);
          this.currentUser$.next(user);
          const errorResponse: Alert = {
              type: 'success',
              message: "Succesfully logged in",
              dismissOnRouteChange: false
          }
          this.alertService.show(errorResponse.type, errorResponse.message, errorResponse.dismissOnRouteChange)
          return user;
        }),
        catchError((error: any) => {
          console.log('error:', error);
          console.log('error.message:', error.message);
          console.log('error.error.message:', error.error.message);
          return this.handleError(error, this.router)
        })
      );
  }

  register(userData: IUser): Observable<IUser | undefined> {
    console.log(`register at ${environment.dataApiUrl}users`);
    console.log(userData);
    return this.http
      .post<IUser>(`${environment.dataApiUrl}users`, userData, {
        headers: this.headers,
      })
      .pipe(
        map((user) => {
          // const user = new User(response);
          console.dir(user);
          this.saveUserToLocalStorage(user);
          this.currentUser$.next(user);
          return user;
        }),
        catchError((error: any) => {
          console.log('error:', error);
          console.log('error.message:', error.message);
          console.log('error.error.message:', error.error.message);
          return this.handleError(error, this.router)
        })
      );
  }

  /**
   * Validate het token bij de backend API. Als er geen HTTP error
   * als response komt is het token nog valid. We doen dan verder niets.
   * Als het token niet valid is loggen we de user uit.
   */
  validateToken(userData: any): Observable<IUser | undefined> {
    const url = `${environment.dataApiUrl}/auth/profile`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + userData.results.access_token,
      }),
    };

    console.log(`validateToken at ${url}`);
    return this.http.get<any>(url, httpOptions).pipe(
      map((response) => {
        console.log('token is valid');
        return response;
      }),
      catchError((error: any) => {
        console.log('Validate token Failed');
        this.logout();
        this.currentUser$.next(undefined);
        return this.handleError(error, this.router)
      })
    );
  }

  logout(): void {
    const url = this.router.url;
    this.router
      .navigate(['/login'])
      .then((success) => {
        if (success) {
          this.router.navigate([url]);
          console.log('logout - removing local user info');
          localStorage.removeItem(this.CURRENT_USER);
          this.currentUser$.next(undefined);
          const errorResponse: Alert = {
              type: 'warning',
              message: "Succesfully logged out",
              dismissOnRouteChange: false
          }
          this.alertService.show(errorResponse.type, errorResponse.message, errorResponse.dismissOnRouteChange)
        } else {
          console.log('navigate result:', success);
        }
        console.log(this.router.events)
      })
      .catch((error) => this.handleError(error, this.router));
  }

  getUserFromLocalStorage(): Observable<IUser> {
    const localUser = JSON.parse(localStorage.getItem(this.CURRENT_USER)!);
    return of(localUser);
  }

  private saveUserToLocalStorage(user: IUser): void {
    localStorage.setItem(this.CURRENT_USER, JSON.stringify(user));
  }

  userMayEdit(itemUserId: string): Observable<boolean> {
    return this.currentUser$.pipe(
      map((user: any) => (user ? user.results.user._id === itemUserId : false))
    );
  }

  userIsTrainer(): Observable<boolean> {
    return this.currentUser$.pipe(
      map((user: any) => (user ? user.results.user.loan != null : false))
    );
  }
  
  public handleError(error: HttpErrorResponse, router: Router): Observable<any> {
    console.log('handleError in UserService', error);
    
    const errorResponse: Alert = {
        type: 'danger',
        message: error.error.message || error.message
    }
    this.alertService.show(errorResponse.type, errorResponse.message, errorResponse.dismissOnRouteChange)
    return throwError(errorResponse);
}
}
