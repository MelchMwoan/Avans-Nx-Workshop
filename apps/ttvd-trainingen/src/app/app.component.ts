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
  ngOnInit(): void {
    initFlowbite();
  }
}
