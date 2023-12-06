import { Component, OnDestroy, OnInit } from '@angular/core';
import { IEnrollment, IExercise, IPlayer, ITraining, IUser } from '@avans-nx-workshop/shared/api';
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
  enrollments: IEnrollment[] = [];
  mayJoin = false;
  mayLeave = false;
  curUser?: any | null;

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
    this.routeSub = this.route.params.subscribe((params) => {
      this.subscription = this.trainingService
        .read(params['id'])
        .subscribe(async (results) => {
          this.authService.getUserFromLocalStorage().subscribe((res: any) => {
            this.mayEdit = results.trainers.some(x => x === res?.results.user._id);
            this.curUser = res?.results.user;
          });
          ;
          const newTrainers: IUser[] = [];
          results.trainers.forEach(async (trainer) => {
            this.userService.read(trainer as any).subscribe((results) => {
              newTrainers.push(results);
            });
            results.trainers = newTrainers;
          });
          this.roomService.read(results.room as any).subscribe((res) => {
            results.room = res;
          });
          const newExercises: IExercise[] = [];
          results.exercises.forEach(async (exercise) => {
            this.exerciseService
              .read(exercise as any)
              .subscribe((results) => {
                newExercises.push(results);
              });
            results.exercises = newExercises;
          });
          this.trainingService.getEnrollments(results._id).subscribe(async (res) => {
            this.enrollments = res?.results;
            this.mayLeave = this.enrollments.some((x: any) => x.player === this.curUser?._id);
            this.mayJoin = results.room.maxAmountOfTables * 2 > this.enrollments.length && !this.mayEdit && !this.mayLeave;
            this.enrollments.forEach(async (enroll) => {
              console.log(enroll);
              this.userService.read((enroll.player as any)).subscribe((play) => {
                enroll.player = play as IPlayer;
              });
            })
            document.getElementById("loading")?.classList.add("hidden");
            if(this.enrollments.length == 0) {
              document.getElementById("noEnrolls")?.classList.remove("hidden");
            }
          });
          this.training = results;
          
        });
    });
  }

  joinTraining() {
    console.log(`Join: ${this.training?.name}`);
    const url = this.router.url;
    const trainingId = this.training?.name;
    if (!trainingId) return console.log('Training ID is not defined');
    this.subscription = (this.trainingService
      .join(trainingId))
      .subscribe((results) => {
        console.log("shfiosfjiofjiodsjf"+results)
        this.router.navigate(['/']).then((success) => {this.router.navigate([url])});
      });
  }
  leaveTraining() {
    console.log(`Leave: ${this.training?.name}`);
    const url = this.router.url;
    const trainingId = this.training?.name;
    if (!trainingId) return console.log('Training ID is not defined');
    this.subscription = this.trainingService
      .leave(trainingId)
      .subscribe((results) => {
        console.log("shfiosfjiofjiodsjf"+results)
        this.router.navigate(['/']).then((success) => {this.router.navigate([url])});
      });
  }

  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe();
    if (this.routeSub) this.routeSub.unsubscribe();
  }
}
