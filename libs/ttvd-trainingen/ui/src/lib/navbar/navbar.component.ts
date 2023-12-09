import { Component } from '@angular/core';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { AuthService } from 'libs/ttvd-trainingen/features/src/lib/auth/auth.service';

@Component({
  selector: 'avans-nx-workshop-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
  name?: string | null;
  email?: string | null;
  constructor(public authService: AuthService) {
    authService.currentUser$.subscribe((result) => {
      if (result == undefined) {
        this.name = null;
        this.email = null;
      } else {
        this.name =
          (result as any)?.results.user.firstName +
          ' ' +
          (result as any)?.results.user.lastName;
        this.email = (result as any)?.results.user.email;
      }
    });
  }
  logout() {
    this.authService.logout();
  }
}
