import {Component, inject, ViewEncapsulation} from '@angular/core';
import {Education} from '../../components/education/education';
import {Experience} from '../../components/experience/experience';
import {Footer} from '../../components/footer/footer';
import {Hero} from '../../components/hero/hero';
import {Skills} from '../../components/skills/skills';
import {EnterOnViewport} from '../../directives/enter-on-viewport';
import {AppCheck} from '../../tokens/firebase.tokens';

@Component({
  selector: 'app-home-page',
  imports: [
    Footer,
    Hero,
    Skills,
    Experience,
    Education,
    EnterOnViewport
  ],
  templateUrl: './home-page.html',
  styleUrl: './home-page.scss',
  encapsulation: ViewEncapsulation.None,
  host: {
    'class': 'home-page'
  }
})
export class HomePage {
  private readonly _appCheck = inject(AppCheck); // initialize AppCheck
}
