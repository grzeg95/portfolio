import {Component, ElementRef, inject, ViewEncapsulation} from '@angular/core';
import {Flipper} from '../flipper/flipper';

@Component({
  selector: 'app-flipper-slide',
  imports: [],
  templateUrl: './flipper-slide.html',
  styleUrl: './flipper-slide.scss',
  encapsulation: ViewEncapsulation.None,
  host: {
    'class': 'flipper-slide'
  }
})
export class FlipperSlide {

  flipper = inject(Flipper);
  elRef = inject(ElementRef);
}
