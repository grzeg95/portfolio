import {Component, inject, OnInit} from '@angular/core';
import {Footer} from './components/footer/footer';
import {Hero} from './components/hero/hero';
import {logEvent} from 'firebase/analytics';
import {Analytics} from './tokens/firebase.tokens';

@Component({
  selector: 'app-root',
  imports: [
    Hero,
    Footer
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {

  private readonly _analytics = inject(Analytics, {optional: true});

  ngOnInit() {
    if (this._analytics) {
      logEvent(this._analytics, 'page_view', {
        method: 'ngOnInit'
      });
    }
  }
}
