/* eslint-disable @nx/enforce-module-boundaries */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Subscription, delay } from 'rxjs';
import {
  Difficulty,
  IExercise,
  IPlayer,
  IRoom,
  ITrainer,
  ITraining,
  IUser,
} from '@avans-nx-workshop/shared/api';
import { ActivatedRoute, Router } from '@angular/router';
import { Modal, ModalInterface, ModalOptions } from 'flowbite';
import {
  CreateTrainingDto,
  UpdateTrainingDto,
} from '@avans-nx-workshop/backend/dto';
import { AuthService } from '../../auth/auth.service';
import { TrainingService } from '../training.service';
import { UserService } from '../../user/user.service';
import { RoomService } from '../../room/room.service';
import { ExerciseService } from '../../exercise/exercise.service';
import { AlertService } from 'libs/ttvd-trainingen/ui/src/lib/alert/alert.service';

@Component({
  selector: 'avans-nx-workshop-user-edit',
  templateUrl: './training-edit.component.html',
  styles: [],
})
export class TrainingEditComponent implements OnInit, OnDestroy {
  training: ITraining | null = null;
  subscription: Subscription | undefined = undefined;
  routeSub: Subscription | undefined = undefined;
  difficultyLevels: string[] = Object.values(Difficulty);
  exerciseChoices?: IExercise[] | null;
  trainerChoices?: ITrainer[] | null;
  roomChoices?: IRoom[] | null;
  curUser?: any | null;

  createTrainingForm = this.formBuilder.group({
    name: ['', Validators.required],
    dateTime: ['', [Validators.required, DateValidator.LessThanToday]],
    description: ['', Validators.required],
    minPlayers: ['', Validators.required],
    difficulty: [Difficulty.Basic, Validators.required],
    trainers: [this.curUser?._id ? this.curUser?._id : [], Validators.required],
    roomId: [null, Validators.required],
    exercises: [[], Validators.required],
  });

  constructor(
    private trainingService: TrainingService,
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private alertService: AlertService,
    private userService: UserService,
    private exerciseService: ExerciseService,
    private roomService: RoomService
  ) {}

  ngOnInit(): void {
    this.authService.userIsTrainer().subscribe((result) => {
      if (!result) {
        this.router.navigate(['/']);
        this.alertService.show(
          'warning',
          'Only trainers are allowed to do this.'
        );
      }
    });
    this.routeSub = this.route.params.subscribe(async (params) => {
      await this.authService
        .getUserFromLocalStorage()
        .subscribe((results: any) => {
          this.curUser = results.results.user;
        });
      await this.userService.list().subscribe((results) => {
        this.trainerChoices = results
          ? results.filter(
              (x: ITrainer | IPlayer): x is ITrainer =>
                (x as ITrainer).loan !== undefined && x._id != this.curUser._id
            )
          : [];
      });
      this.createTrainingForm.get('trainers')?.setValue([this.curUser._id]);
      await this.roomService.list().subscribe((results) => {
        this.roomChoices = results
          ? results.filter((x: IRoom) => !x.isInMaintenance): [];
      });
      await this.exerciseService.list().subscribe((results) => {
        this.exerciseChoices = results;
      });
      if (params['id']) {
        this.subscription = this.trainingService
          .read(params['id'])
          .subscribe((results) => {
            console.log(results);
            this.training = results;
            if (!this.training.trainers.includes(this.curUser._id)) {
              this.router.navigate(['/trainings']);
              this.alertService.show(
                'warning',
                'You are not authorized to edit this training.'
              );
            }
            this.createTrainingForm.markAllAsTouched();
          });
        const $modalElement: HTMLElement | null =
          document.querySelector('#popup-modal');
        const $modalOptions: ModalOptions = {
          placement: 'bottom-right',
          backdrop: 'dynamic',
          closable: true,
        };
        const modal: ModalInterface = new Modal($modalElement, $modalOptions);
        document
          .querySelector('#deleteTrainingBtn')
          ?.addEventListener('click', function () {
            modal.show();
          });
        document
          .querySelector('#closeModalBtn')
          ?.addEventListener('click', function () {
            modal.hide();
          });
        document
          .querySelector('#confirmDeleteBtn')
          ?.addEventListener('click', function () {
            modal.hide();
          });
        document
          .querySelector('#cancelBtn')
          ?.addEventListener('click', function () {
            modal.hide();
          });
      }
    });
    this.createTrainingForm
      .get('trainers')
      ?.valueChanges.subscribe((selectedTrainers: string[]) => {
        if (!selectedTrainers?.includes(this.curUser?._id)) {
          selectedTrainers?.push(this.curUser?._id);
          this.createTrainingForm.get('trainers')?.setValue(selectedTrainers);
        }
      });
  }

  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe();
    if (this.routeSub) this.routeSub.unsubscribe();
  }

  onSubmit() {
    console.log(this.createTrainingForm.value);
    if (this.createTrainingForm.invalid)
      return this.createTrainingForm.markAllAsTouched();
    if (this.training != null) {
      console.log(`Updating: ${this.createTrainingForm}`);
      const id = this.training.name;
      const training: UpdateTrainingDto = this.createTrainingForm
        .value as unknown as UpdateTrainingDto;
      this.subscription = this.trainingService
        .update(id, training)
        .subscribe((results) => {
          console.log(results);
          this.router.navigate(['/training/' + results.results.name]);
        });
    } else {
      console.log(
        `Creating training: ${JSON.stringify(this.createTrainingForm.value)}`
      );
      let training: CreateTrainingDto = this.createTrainingForm
        .value as unknown as CreateTrainingDto;
      training = {
        ...training,
        room: training.roomId,
      };
      this.subscription = this.trainingService
        .create(training)
        .subscribe((results) => {
          this.router.navigate(['/training/' + results.results.name]);
        });
    }
  }

  deleteTraining() {
    console.log(`Delete: ${this.training?._id}`);
    const trainingId = this.training?.name;
    if (!trainingId) return console.log('Training ID is not defined');
    this.subscription = this.trainingService
      .delete(trainingId)
      .subscribe((results) => {
        this.router.navigate(['/trainings']);
      });
  }

  async refreshAttributes() {
    console.log(`Refreshing attributes`);
    document.querySelector('#refreshRooms')?.classList.remove("hidden");
    document.querySelector('#refreshExercises')?.classList.remove("hidden");
    document.querySelector('#refreshTrainers')?.classList.remove("hidden");
    await new Promise(resolve => setTimeout(resolve, 1000));
    await this.userService.list().subscribe((results) => {
      this.trainerChoices = results
        ? results.filter(
            (x: ITrainer | IPlayer): x is ITrainer =>
              (x as ITrainer).loan !== undefined && x._id != this.curUser._id
          )
        : [];
        document.querySelector('#refreshTrainers')?.classList.add("hidden");
    });
    await this.roomService.list().subscribe((results) => {
      this.roomChoices = results;
      document.querySelector('#refreshRooms')?.classList.add("hidden");
    });
    await this.exerciseService.list().subscribe((results) => {
      this.exerciseChoices = results;
      document.querySelector('#refreshExercises')?.classList.add("hidden");
    });
  }
}
export class DateValidator {
  static LessThanToday(control: FormControl): ValidationErrors | null {
    const today: Date = new Date();
    today.setHours(0, 0, 0, 0);
    if (new Date(control.value) < today) return { LessThanToday: true };

    return null;
  }
}
