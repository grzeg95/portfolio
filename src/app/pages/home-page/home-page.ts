import {Component, computed, inject} from '@angular/core';
import {toSignal} from '@angular/core/rxjs-interop';
import {ActivatedRoute} from '@angular/router';
import {Footer} from '../../components/footer/footer';
import {Hero} from '../../components/hero/hero';
import {Skills} from '../../components/skills/skills';
import {HomePageFirestore} from '../../models/home-page.firestore';

@Component({
  selector: 'app-home-page',
  imports: [
    Footer,
    Hero,
    Skills
  ],
  templateUrl: './home-page.html',
  styleUrl: './home-page.scss',
})
export class HomePage {
  private readonly _activatedRoute = inject(ActivatedRoute);
  private readonly data = toSignal(this._activatedRoute.data);
  protected _homePage = computed(() => this.data()?.['homePage'] as HomePageFirestore);
}
