import { Component, OnDestroy, OnInit } from '@angular/core';
import { IExercise, ITraining, IUser } from '@avans-nx-workshop/shared/api';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { TrainingService } from '../training.service';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { AlertService } from 'libs/ttvd-trainingen/ui/src/lib/alert/alert.service';
import { UserService } from '../../user/user.service';
import { RoomService } from '../../room/room.service';
import { ExerciseService } from '../../exercise/exercise.service';

@Component({
  selector: 'avans-nx-workshop-user-detail',
  templateUrl: './training-detail.component.html',
  styles: [],
})
export class TrainingDetailComponent implements OnInit, OnDestroy {
  training: ITraining | null = null;
  subscription: Subscription | undefined = undefined;
  routeSub: Subscription | undefined = undefined;
  mayEdit = false;

  constructor(
    private trainingService: TrainingService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private alertService: AlertService,
    private router: Router,
    private userService: UserService,
    private roomService: RoomService,
    private exerciseService: ExerciseService
  ) {}

  ngOnInit(): void {
    this.authService
      .userIsTrainer()
      .subscribe((isTrainer) => (this.mayEdit = isTrainer));
    this.routeSub = this.route.params.subscribe((params) => {
      this.subscription = this.trainingService
        .read(params['id'])
        .subscribe(async (results) => {
          const newTrainers: IUser[] = [];
          results.trainers.forEach(async (trainer) => {
            await this.userService.read(trainer as any).subscribe((results) => {
              newTrainers.push(results);
            });
            results.trainers = newTrainers;
          });
          await this.roomService.read(results.room as any).subscribe((res) => {
            results.room = res;
          });
          const newExercises: IExercise[] = [];
          results.exercises.forEach(async (exercise) => {
            await this.exerciseService
              .read(exercise as any)
              .subscribe((results) => {
                newExercises.push(results);
              });
            results.exercises = newExercises;
          });
          this.training = results;
        });
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe();
    if (this.routeSub) this.routeSub.unsubscribe();
  }
}
