import { Component, OnDestroy, OnInit } from '@angular/core';
import { IExercise } from '@avans-nx-workshop/shared/api';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { ExerciseService } from '../exercise.service';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { AlertService } from 'libs/ttvd-trainingen/ui/src/lib/alert/alert.service';


@Component({
  selector: 'avans-nx-workshop-user-detail',
  templateUrl: './exercise-detail.component.html',
  styles: [],
})
export class ExerciseDetailComponent implements OnInit, OnDestroy {
  exercise: IExercise | null = null;
  subscription: Subscription | undefined = undefined;
  routeSub: Subscription | undefined = undefined;
  mayEdit = false;

  constructor(private exerciseService: ExerciseService, private route: ActivatedRoute, private authService: AuthService, private alertService: AlertService, private router: Router) {}

  ngOnInit(): void {
    this.authService.userIsTrainer().subscribe(isTrainer => this.mayEdit = isTrainer)
    this.routeSub = this.route.params.subscribe(params => {
      this.subscription = this.exerciseService.read(params['id']).subscribe((results) => {
        this.exercise = results;
      });
    });
  }

  ngOnDestroy(): void {
      if(this.subscription) this.subscription.unsubscribe();
      if(this.routeSub) this.routeSub.unsubscribe();
  }
}
