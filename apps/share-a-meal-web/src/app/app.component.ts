import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterModule, RouterOutlet } from '@angular/router';
import { FeaturesModule } from '@avans-nx-workshop/share-a-meal/features';
import { UiModule } from '@avans-nx-workshop/share-a-meal/ui';
import { initFlowbite } from 'flowbite';

@Component({
  standalone: true,
  imports: [RouterModule, RouterOutlet, RouterLink, RouterLinkActive, FeaturesModule, UiModule],
  selector: 'avans-nx-workshop-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'share-a-meal-web';
  ngOnInit(): void {
      initFlowbite();
  }
}
