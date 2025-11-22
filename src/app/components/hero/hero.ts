import {Component, ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'app-hero',
  imports: [],
  templateUrl: './hero.html',
  styleUrl: './hero.scss',
  encapsulation: ViewEncapsulation.None,
  host: {
    'class': 'hero'
  }
})
export class Hero {

}
