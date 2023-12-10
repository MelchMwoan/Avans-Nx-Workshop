import { Component, OnDestroy, OnInit } from '@angular/core';
import { ITraining, IUser } from '@avans-nx-workshop/shared/api';
import { Subscription, Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { RoomService } from '../room/room.service';
import { TrainingService } from '../training/training.service';
import { UserService } from '../user/user.service';

@Component({
  selector: 'avans-nx-workshop-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit, OnDestroy {
  trainings: ITraining[] | null = null;
  enrolledTrainings: ITraining[] | null = null;
  subscription: Subscription | undefined = undefined;

  constructor(
    private trainingService: TrainingService,
    public authService: AuthService,
    private userService: UserService,
    private roomService: RoomService
  ) {}

  async ngOnInit(): Promise<void> {
    await this.authService.getUserFromLocalStorage().subscribe((res) => {
      if(res == null) {
        document.getElementById('loading')?.classList.add('hidden');
        document.getElementById('loadingEnrolls')?.classList.add('hidden');
      }
      if (res !== null) {
        this.subscription = this.trainingService
          .rcmnd()
          .subscribe((results) => {
            this.trainings = results;
            this.trainings?.forEach((training) => {
              const newTrainers: IUser[] = [];
              training.trainers.forEach(async (trainer) => {
                await this.userService
                  .read(trainer as any)
                  .subscribe((results) => {
                    newTrainers.push(results);
                  });
                training.trainers = newTrainers;
                await this.roomService
                  .read(training.room as any)
                  .subscribe((results) => {
                    training.room = results;
                  });
              });
            });
            document.getElementById('loading')?.classList.add('hidden');
            if (this.trainings?.length == 0)
              document.getElementById('noInput')?.classList.remove('hidden');
          });
        this.subscription = this.trainingService
          .getEnrollmentsPlayer()
          .subscribe((results) => {
            this.enrolledTrainings = results;
            // this.trainings?.forEach((training) => {
            //   const newTrainers: IUser[] = [];
            //   training.trainers.forEach(async (trainer) => {
            //     await this.userService.read(trainer as any).subscribe((results) => {
            //       newTrainers.push(results);
            //     });
            //     training.trainers = newTrainers;
            //     await this.roomService.read(training.room as any).subscribe((results) => {
            //       training.room = results;
            //     })
            //   })
            // })
            document.getElementById('loadingEnrolls')?.classList.add('hidden');
            if (this.enrolledTrainings?.length == 0)
              document
                .getElementById('noInputEnrolls')
                ?.classList.remove('hidden');
          });
      }
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe();
  }

  isTrainer(): Observable<boolean> {
    return this.authService.userIsTrainer();
  }
}
