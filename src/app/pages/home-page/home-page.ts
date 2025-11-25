import {Component} from '@angular/core';
import {Footer} from '../../components/footer/footer';
import {Hero} from '../../components/hero/hero';

@Component({
  selector: 'app-home-page',
  imports: [
    Footer,
    Hero
  ],
  templateUrl: './home-page.html',
  styleUrl: './home-page.scss',
})
export class HomePage {
}
