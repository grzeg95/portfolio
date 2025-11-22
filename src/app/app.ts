import {Component} from '@angular/core';
import {Hero} from './components/hero/hero';

@Component({
  selector: 'app-root',
  imports: [
    Hero
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
}
