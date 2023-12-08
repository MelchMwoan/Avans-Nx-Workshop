import { Component } from '@angular/core';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { AuthService } from 'libs/ttvd-trainingen/features/src/lib/auth/auth.service';

@Component({
  selector: 'avans-nx-workshop-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
  email?: string | null;
  constructor(public authService: AuthService) {
    authService.currentUser$.subscribe((result) => {
      if (result == undefined) {
        this.email = null;
      } else {
        this.email =
          (result as any)?.results.user.firstName +
          ' ' +
          (result as any)?.results.user.lastName;
      }
    });
  }
  logout() {
    this.authService.logout();
  }
}
