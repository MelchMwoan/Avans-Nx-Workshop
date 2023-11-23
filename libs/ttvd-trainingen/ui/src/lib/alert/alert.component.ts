import { Component, OnDestroy, OnInit } from '@angular/core';
import { Dismiss, DismissOptions } from 'flowbite';
import { Alert, AlertService } from './alert.service';
import { Subscription } from 'rxjs';
import { NavigationStart, Router } from '@angular/router';

@Component({
  selector: 'avans-nx-workshop-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css'],
})
export class AlertComponent implements OnInit, OnDestroy {
  targetEl: HTMLElement | null = null;
  dismissInstance: Dismiss | null = null;
  errorMsg = '';
  alertType = '';
  dismissOnRouteChange? = false;
  subs!: Subscription;

  constructor(private alertService: AlertService, private router: Router) {}
  ngOnInit(): void {
    this.subs = this.alertService.alert$.subscribe((alert) => {
      this.dismissPreviousAlert();
      this.errorMsg = alert.message;
      this.alertType = alert.type;
      this.dismissOnRouteChange = alert.dismissOnRouteChange;
      this.targetEl = document.getElementById('alert');
      if (this.targetEl == null) return;
      this.dismissInstance = new Dismiss(this.targetEl);
      setTimeout(() => (this.dismissPreviousAlert()), 6000);
    });

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        if (this.dismissOnRouteChange) {
          this.dismissPreviousAlert();
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.dismissPreviousAlert();
    if (this.subs) {
      this.subs.unsubscribe();
    }
  }
  dismissPreviousAlert(): void {
    if (this.dismissInstance) {
      this.dismissInstance.destroy();
      this.dismissInstance = null;
      this.errorMsg = '';
      this.alertType = '';
    }
  }
}
