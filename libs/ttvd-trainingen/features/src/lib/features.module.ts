import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MealListComponent } from './meal/meal-list/meal-list.component';
import { MealDetailComponent } from './meal/meal-detail/meal-detail.component';
import { MealService } from './meal/meal.service';
import { AboutComponent } from './about/about.component';
import { HomeComponent } from './home/home.component';
import { UserDetailComponent } from './user/user-detail/user-detail.component';
import { UserListComponent } from './user/user-list/user-list.component';
import { UserService } from './user/user.service';
import { RouterModule } from '@angular/router';
import { UserEditComponent } from './user/user-edit/user-edit.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './auth/login/login.component';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { UiModule } from '@avans-nx-workshop/ttvd-trainingen/ui';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from './auth/auth.service';
import { RoomListComponent } from './room/room-list/room-list.component';
import { RoomService } from './room/room.service';
import { RoomDetailComponent } from './room/room-detail/room-detail.component';
import { RoomEditComponent } from './room/room-edit/room-edit.component';
import { ExerciseListComponent } from './exercise/exercise-list/exercise-list.component';
import { ExerciseService } from './exercise/exercise.service';
import { ExerciseDetailComponent } from './exercise/exercise-detail/exercise-detail.component';
import { ExerciseEditComponent } from './exercise/exercise-edit/exercise-edit.component';
import { TrainingListComponent } from './training/training-list/training-list.component';
import { TrainingService } from './training/training.service';
import { TrainingDetailComponent } from './training/training-detail/training-detail.component';

@NgModule({
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule, UiModule, HttpClientModule],
  declarations: [
    MealListComponent,
    MealDetailComponent,
    AboutComponent,
    HomeComponent,
    UserDetailComponent,
    UserListComponent,
    UserEditComponent,
    LoginComponent,
    RoomListComponent,
    RoomDetailComponent,
    RoomEditComponent,
    ExerciseListComponent,
    ExerciseDetailComponent,
    ExerciseEditComponent,
    TrainingListComponent,
    TrainingDetailComponent
  ],
  providers: [MealService, UserService, AuthService, RoomService, ExerciseService, TrainingService],
  exports: [
    MealListComponent,
    MealDetailComponent,
    AboutComponent,
    HomeComponent,
    UserDetailComponent,
    UserListComponent,
    UserEditComponent,
    LoginComponent,
    RoomListComponent,
    RoomDetailComponent,
    RoomEditComponent,
    ExerciseListComponent,
    ExerciseDetailComponent,
    ExerciseEditComponent,
    TrainingListComponent,
    TrainingDetailComponent
  ],
})
export class FeaturesModule {}
