import { Component } from '@angular/core';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { AuthService } from 'libs/ttvd-trainingen/features/src/lib/auth/auth.service';

@Component({
  selector: 'avans-nx-workshop-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})

export class NavbarComponent {
  email = '';
  constructor(public authService: AuthService) {authService.getUserFromLocalStorage().subscribe((result) => {this.email=(result as any)?.results.user.email})
  }
  logout() {
    this.authService.logout();
  }
}
