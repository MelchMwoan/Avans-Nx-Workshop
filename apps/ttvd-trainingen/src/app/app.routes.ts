/* eslint-disable @nx/enforce-module-boundaries */
import { Routes } from '@angular/router';
import { AboutComponent } from 'libs/ttvd-trainingen/features/src/lib/about/about.component';
import { MealListComponent } from 'libs/ttvd-trainingen/features/src/lib/meal/meal-list/meal-list.component';
import { HomeComponent } from 'libs/ttvd-trainingen/features/src/lib/home/home.component';
import { UserListComponent } from 'libs/ttvd-trainingen/features/src/lib/user/user-list/user-list.component';
import { UserDetailComponent } from 'libs/ttvd-trainingen/features/src/lib/user/user-detail/user-detail.component';
import { UserEditComponent } from 'libs/ttvd-trainingen/features/src/lib/user/user-edit/user-edit.component';
import { LoginComponent } from 'libs/ttvd-trainingen/features/src/lib/auth/login/login.component';
import { RoomListComponent } from 'libs/ttvd-trainingen/features/src/lib/room/room-list/room-list.component';
import { RoomDetailComponent } from 'libs/ttvd-trainingen/features/src/lib/room/room-detail/room-detail.component';
import { RoomEditComponent } from 'libs/ttvd-trainingen/features/src/lib/room/room-edit/room-edit.component';
import { ExerciseListComponent } from 'libs/ttvd-trainingen/features/src/lib/exercise/exercise-list/exercise-list.component';
import { ExerciseDetailComponent } from 'libs/ttvd-trainingen/features/src/lib/exercise/exercise-detail/exercise-detail.component';
import { ExerciseEditComponent } from 'libs/ttvd-trainingen/features/src/lib/exercise/exercise-edit/exercise-edit.component';
import { TrainingListComponent } from 'libs/ttvd-trainingen/features/src/lib/training/training-list/training-list.component';
import { TrainingDetailComponent } from 'libs/ttvd-trainingen/features/src/lib/training/training-detail/training-detail.component';

export const appRoutes: Routes = [
  {
    path: 'home',
    title: 'Home',
    component: HomeComponent,
  },
  {
    path: 'about',
    title: 'About',
    component: AboutComponent,
  },
  {
    path: 'meals',
    title: 'Meal List',
    component: MealListComponent,
  },
  {
    path: 'users',
    title: 'User List',
    component: UserListComponent
  },
  {
    path: 'user/create',
    title: 'Create User',
    component: UserEditComponent
  },
  {
    path: 'user/edit/:id',
    title: 'Edit User',
    component: UserEditComponent
  },
  {
    path: 'user/:id',
    title: 'User Details',
    component: UserDetailComponent
  },
  {
    path: 'rooms',
    title: 'Room List',
    component: RoomListComponent
  },
  {
    path: 'room/create',
    title: 'Create Room',
    component: RoomEditComponent
  },
  {
    path: 'room/edit/:id',
    title: 'Edit Room',
    component: RoomEditComponent
  },
  {
    path: 'room/:id',
    title: 'Room Details',
    component: RoomDetailComponent
  },
  {
    path: 'exercises',
    title: 'Exercise List',
    component: ExerciseListComponent
  },
  {
    path: 'exercise/create',
    title: 'Create Exercise',
    component: ExerciseEditComponent
  },
  {
    path: 'exercise/edit/:id',
    title: 'Edit Exercise',
    component: ExerciseEditComponent
  },
  {
    path: 'exercise/:id',
    title: 'Exercise Details',
    component: ExerciseDetailComponent
  },
  {
    path: 'trainings',
    title: 'Training List',
    component: TrainingListComponent
  },
  {
    path: 'training/create',
    title: 'Create Training',
    component: ExerciseEditComponent
  },
  {
    path: 'training/edit/:id',
    title: 'Edit Training',
    component: ExerciseEditComponent
  },
  {
    path: 'training/:id',
    title: 'Training Details',
    component: TrainingDetailComponent
  },
  {
    path: 'login',
    title: 'Login',
    component: LoginComponent
  },
  {
    path: 'register',
    title: 'Register',
    component: UserEditComponent
  },
  {
    path: '**',
    redirectTo: 'home',
  },
];
