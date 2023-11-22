/* eslint-disable @nx/enforce-module-boundaries */
import { Routes } from '@angular/router';
import { AboutComponent } from 'libs/ttvd-trainingen/features/src/lib/about/about.component';
import { MealListComponent } from 'libs/ttvd-trainingen/features/src/lib/meal/meal-list/meal-list.component';
import { HomeComponent } from 'libs/ttvd-trainingen/features/src/lib/home/home.component';
import { UserListComponent } from 'libs/ttvd-trainingen/features/src/lib/user/user-list/user-list.component';
import { UserDetailComponent } from 'libs/ttvd-trainingen/features/src/lib/user/user-detail/user-detail.component';
import { UserEditComponent } from 'libs/ttvd-trainingen/features/src/lib/user/user-edit/user-edit.component';
import { LoginComponent } from 'libs/ttvd-trainingen/features/src/lib/auth/login/login.component';

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
