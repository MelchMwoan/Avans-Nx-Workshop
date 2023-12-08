import { Component, OnInit } from '@angular/core';
import {
  RouterLink,
  RouterLinkActive,
  RouterModule,
  RouterOutlet,
} from '@angular/router';
import { FeaturesModule } from '@avans-nx-workshop/ttvd-trainingen/features';
import { UiModule } from '@avans-nx-workshop/ttvd-trainingen/ui';
import { initFlowbite } from 'flowbite';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { AuthService } from 'libs/ttvd-trainingen/features/src/lib/auth/auth.service';

@Component({
  standalone: true,
  imports: [
    RouterModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    FeaturesModule,
    UiModule,
  ],
  selector: 'avans-nx-workshop-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'ttvd-trainingen';

  constructor(private authService: AuthService){};

  ngOnInit(): void {
    initFlowbite();
    this.authService.getUserFromLocalStorage().subscribe((res) => {
      if(res != null) this.authService.validateToken(res).subscribe();
    });
  }
}
