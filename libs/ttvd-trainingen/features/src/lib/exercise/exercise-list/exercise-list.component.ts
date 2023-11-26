import { Component, OnDestroy, OnInit } from '@angular/core';
import { IExercise } from '@avans-nx-workshop/shared/api';
import { Observable, Subscription } from 'rxjs';
import { ExerciseService } from '../exercise.service';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'avans-nx-workshop-user-list',
  templateUrl: './exercise-list.component.html',
  styles: [],
})
export class ExerciseListComponent implements OnInit, OnDestroy {
  exercises: IExercise[] | null = null;
  subscription: Subscription | undefined = undefined;

  constructor(private exerciseService: ExerciseService, private authService: AuthService) {}

  ngOnInit(): void {
      this.subscription = this.exerciseService.list().subscribe((results) => {
        this.exercises = results;
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
