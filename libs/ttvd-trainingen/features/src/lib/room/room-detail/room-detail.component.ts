import { Component, OnDestroy, OnInit } from '@angular/core';
import { IRoom } from '@avans-nx-workshop/shared/api';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { RoomService } from '../room.service';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { AlertService } from 'libs/ttvd-trainingen/ui/src/lib/alert/alert.service';


@Component({
  selector: 'avans-nx-workshop-user-detail',
  templateUrl: './room-detail.component.html',
  styles: [],
})
export class RoomDetailComponent implements OnInit, OnDestroy {
  room: IRoom | null = null;
  subscription: Subscription | undefined = undefined;
  routeSub: Subscription | undefined = undefined;
  mayEdit = false;

  constructor(private roomService: RoomService, private route: ActivatedRoute, private authService: AuthService, private alertService: AlertService, private router: Router) {}

  ngOnInit(): void {
    this.authService.userIsTrainer().subscribe(isTrainer => {
      if(!isTrainer) {this.alertService.show("danger", "Unauthorized", false);
      this.router.navigate(['/rooms'])}
    })
    this.routeSub = this.route.params.subscribe(params => {
      this.subscription = this.roomService.read(params['id']).subscribe((results) => {
        this.room = results;
      });
    });
  }

  ngOnDestroy(): void {
      if(this.subscription) this.subscription.unsubscribe();
      if(this.routeSub) this.routeSub.unsubscribe();
  }
}
