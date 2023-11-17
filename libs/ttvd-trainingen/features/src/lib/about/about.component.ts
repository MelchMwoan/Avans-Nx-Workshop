import { Component, OnInit } from '@angular/core';
import { initFlowbite } from 'flowbite';

@Component({
  selector: 'avans-nx-workshop-about',
  templateUrl: './about.component.html',
  styles: [],
})
export class AboutComponent implements OnInit {
  imagePath?: string;
  ngOnInit(): void {
    this.imagePath = '/assets/IndivDomain.drawio.png';
  }
}
