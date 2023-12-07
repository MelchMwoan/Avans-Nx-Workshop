import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface Alert {
  type: string;
  message: string;
  dismissOnRouteChange?: boolean;
  duration?: number;
}

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  public alert$ = new Subject<Alert>();

  show(type: string, msg: string, dismissOnRouteChange?: boolean, duration?: number): void {
    this.alert$.next({ type: type, message: msg, dismissOnRouteChange: dismissOnRouteChange !== undefined ? dismissOnRouteChange : true, duration: duration !== undefined ? duration : 6000});
  }
}
