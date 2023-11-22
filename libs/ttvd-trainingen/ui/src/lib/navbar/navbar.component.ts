import { Component } from '@angular/core';
import { AuthService } from 'libs/ttvd-trainingen/features/src/lib/auth/auth.service';

@Component({
  selector: 'avans-nx-workshop-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})

export class NavbarComponent {
  constructor(public authService: AuthService) {}
  logout() {
    this.authService.logout();
  }
}
