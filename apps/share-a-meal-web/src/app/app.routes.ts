/* eslint-disable @nx/enforce-module-boundaries */
import { Routes } from '@angular/router';
import { AboutComponent } from 'libs/share-a-meal/features/src/lib/about/about.component';
import { MealListComponent } from 'libs/share-a-meal/features/src/lib/meal/meal-list/meal-list.component';
import { AppComponent } from './app.component';

export const appRoutes: Routes = [
    {
        path: 'home',
        title: 'Home',
        component: AppComponent
    },
    {
        path: 'about',
        title: 'About',
        component: AboutComponent
    },
    {
        path: 'meals',
        title: 'Meal List',
        component: MealListComponent
    },
    {
        path: '**',
        redirectTo: 'home'
    }
];

