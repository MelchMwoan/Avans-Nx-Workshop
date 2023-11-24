import { Component, OnDestroy, OnInit } from '@angular/core';
import { IRoom } from '@avans-nx-workshop/shared/api';
import { Observable, Subscription, firstValueFrom } from 'rxjs';
import { RoomService } from '../room.service';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'avans-nx-workshop-user-list',
  templateUrl: './room-list.component.html',
  styles: [],
})
export class RoomListComponent implements OnInit, OnDestroy {
  rooms: IRoom[] | null = null;
  subscription: Subscription | undefined = undefined;

  constructor(private roomService: RoomService, private authService: AuthService) {}

  ngOnInit(): void {
      this.subscription = this.roomService.list().subscribe((results) => {
        this.rooms = results;
        document.getElementById("loading")?.classList.add("hidden");
      });
  }

  ngOnDestroy(): void {
      if(this.subscription) this.subscription.unsubscribe();
  }

  isTrainer(): Observable<boolean> {
    return this.authService.userIsTrainer();
  }
}
