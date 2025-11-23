import {Component} from '@angular/core';
import {Footer} from './components/footer/footer';
import {Hero} from './components/hero/hero';

@Component({
  selector: 'app-root',
  imports: [
    Hero,
    Footer
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
}
