import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';
import { RouterModule } from '@angular/router'
import { AlertComponent } from './alert/alert.component';

@NgModule({
  imports: [CommonModule, RouterModule],
  declarations: [NavbarComponent, AlertComponent],
  exports: [NavbarComponent, AlertComponent]
})
export class UiModule {}
