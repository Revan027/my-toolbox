import { Component, input, OnInit } from '@angular/core';

@Component({
  standalone: false,
  selector: 'app-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.scss'],
})
export class ProgressBarComponent  implements OnInit {

  libelle = input.required<string>();
  currentValue = input<number>(0);

  constructor() { }

  ngOnInit() {}

}
