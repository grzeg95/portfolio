import {Component, computed, inject, ViewEncapsulation} from '@angular/core';
import {toSignal} from '@angular/core/rxjs-interop';
import {ActivatedRoute} from '@angular/router';
import {Education} from '../../components/education/education';
import {Footer} from '../../components/footer/footer';
import {Hero} from '../../components/hero/hero';
import {Skills} from '../../components/skills/skills';
import {Work} from '../../components/work/work';
import {EnterOnViewport} from '../../directives/enter-on-viewport';
import {HomePageFirestore} from '../../models/home-page.firestore';

@Component({
  selector: 'app-home-page',
  imports: [
    Footer,
    Hero,
    Skills,
    Work,
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
  private readonly _activatedRoute = inject(ActivatedRoute);
  private readonly data = toSignal(this._activatedRoute.data);
  protected _homePage = computed(() => this.data()?.['homePage'] as HomePageFirestore);
}
