/* eslint-disable @nx/enforce-module-boundaries */
import { Routes } from '@angular/router';
import { AboutComponent } from 'libs/share-a-meal/features/src/lib/about/about.component';
import { MealListComponent } from 'libs/share-a-meal/features/src/lib/meal/meal-list/meal-list.component';
import { HomeComponent } from 'libs/share-a-meal/features/src/lib/home/home.component';

export const appRoutes: Routes = [
    {
        path: 'home',
        title: 'Home',
        component: HomeComponent
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

