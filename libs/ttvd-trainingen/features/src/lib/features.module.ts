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
import { RegisterComponent } from './auth/register/register.component';
import { UiModule } from '@avans-nx-workshop/ttvd-trainingen/ui';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from './auth/auth.service';

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
    RegisterComponent
  ],
  providers: [MealService, UserService, AuthService],
  exports: [
    MealListComponent,
    MealDetailComponent,
    AboutComponent,
    HomeComponent,
    UserDetailComponent,
    UserListComponent,
    UserEditComponent,
    LoginComponent,
    RegisterComponent
  ],
})
export class FeaturesModule {}
