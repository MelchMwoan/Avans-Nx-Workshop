import { Component, OnDestroy, OnInit } from '@angular/core';
import { ITrainer, ITraining, IUser } from '@avans-nx-workshop/shared/api';
import { Observable, Subscription } from 'rxjs';
import { TrainingService } from '../training.service';
import { AuthService } from '../../auth/auth.service';
import { UserService } from '../../user/user.service';
import { RoomService } from '../../room/room.service';

@Component({
  selector: 'avans-nx-workshop-user-list',
  templateUrl: './training-list.component.html',
  styles: [],
})
export class TrainingListComponent implements OnInit, OnDestroy {
  trainings: ITraining[] | null = null;
  subscription: Subscription | undefined = undefined;

  constructor(private trainingService: TrainingService, private authService: AuthService, private userService: UserService, private roomService: RoomService) {}

  ngOnInit(): void {
      this.subscription = this.trainingService.list().subscribe((results) => {
        this.trainings = results;
        this.trainings?.forEach((training) => {
          const newTrainers: IUser[] = [];
          training.trainers.forEach(async (trainer) => {
            await this.userService.read(trainer as any).subscribe((results) => {
              newTrainers.push(results);
            });
            training.trainers = newTrainers;
            await this.roomService.read(training.room as any).subscribe((results) => {
              training.room = results;
            })
          })
        })
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
