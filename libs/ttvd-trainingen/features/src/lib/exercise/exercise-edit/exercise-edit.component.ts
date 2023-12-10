/* eslint-disable @nx/enforce-module-boundaries */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Difficulty, IExercise } from '@avans-nx-workshop/shared/api';
import { ActivatedRoute, Router } from '@angular/router';
import { Modal, ModalInterface, ModalOptions } from 'flowbite';
import { CreateExerciseDto, UpdateExerciseDto } from '@avans-nx-workshop/backend/dto';
import { AuthService } from '../../auth/auth.service';
import { ExerciseService } from '../exercise.service';
import { AlertService } from 'libs/ttvd-trainingen/ui/src/lib/alert/alert.service';

@Component({
  selector: 'avans-nx-workshop-user-edit',
  templateUrl: './exercise-edit.component.html',
  styles: [],
})
export class ExerciseEditComponent implements OnInit, OnDestroy {
  exercise: IExercise | null = null;
  subscription: Subscription | undefined = undefined;
  routeSub: Subscription | undefined = undefined;
  difficultyLevels: string[] = Object.values(Difficulty);
  curUser?: any | null;

  createExerciseForm = this.formBuilder.group({
    name: ['', Validators.required],
    description: ['', Validators.required],
    difficulty: [Difficulty.Basic, Validators.required],
  })

  constructor(private exerciseService: ExerciseService, private formBuilder: FormBuilder, private router: Router, private route: ActivatedRoute, private authService: AuthService, private alertService: AlertService) {}

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
    this.routeSub = this.route.params.subscribe(async params => {
      await this.authService
        .getUserFromLocalStorage()
        .subscribe((results: any) => {
          this.curUser = results.results.user;
        });
      if(params['id']) {
        this.subscription = this.exerciseService.read(params['id']).subscribe((results) => {
          console.log(results);
          this.exercise = results;
          if (this.exercise.owner != this.curUser._id) {
            this.router.navigate(['/exercises']);
            this.alertService.show(
              'warning',
              'You are not authorized to edit this exercise.'
            );
          }
          this.exercise = results;
          this.createExerciseForm.markAllAsTouched();
        });
        const $modalElement: HTMLElement | null = document.querySelector('#popup-modal');
        const $modalOptions: ModalOptions = {
          placement: 'bottom-right',
          backdrop: 'dynamic',
          closable: true
        }
        const modal: ModalInterface = new Modal($modalElement, $modalOptions);
        document.querySelector('#deleteExerciseBtn')?.addEventListener('click', function() {modal.show()});
        document.querySelector('#closeModalBtn')?.addEventListener('click', function() {modal.hide()});
        document.querySelector('#confirmDeleteBtn')?.addEventListener('click', function() {modal.hide()});
        document.querySelector('#cancelBtn')?.addEventListener('click', function() {modal.hide()});
      }
    });    
  }

  ngOnDestroy(): void {
      if(this.subscription) this.subscription.unsubscribe();
      if(this.routeSub) this.routeSub.unsubscribe();
  }

  onSubmit() {
    if(this.createExerciseForm.invalid) return this.createExerciseForm.markAllAsTouched();
    if(this.exercise != null) {
      console.log(`Updating: ${this.createExerciseForm}`);
      const id = this.exercise.name;
        const exercise: UpdateExerciseDto = this.createExerciseForm.value as UpdateExerciseDto;
        this.subscription = this.exerciseService.update(id, exercise).subscribe((results) => {
          console.log(results);
          this.router.navigate(['/exercise/'+results.results.name])
        });
    } else {
        console.log(`Creating exercise: ${JSON.stringify(this.createExerciseForm.value)}`);
        const exercise: CreateExerciseDto = this.createExerciseForm.value as unknown as CreateExerciseDto;
        this.subscription = this.exerciseService.create(exercise).subscribe((results) => {
          this.router.navigate(['/exercise/'+results.results.name])
        });
      }
  }

  deleteExercise() {
    console.log(`Delete: ${this.exercise?._id}`);
    const exerciseId = this.exercise?.name;
    if(!exerciseId) return console.log('Exercise ID is not defined')
    this.subscription = this.exerciseService.delete(exerciseId).subscribe((results) => {
      this.router.navigate(['/exercises'])
    });
  }
}