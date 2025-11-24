import {DialogRef} from '@angular/cdk/dialog';
import {Component, ElementRef, inject, OnInit, ViewEncapsulation} from '@angular/core';
import {Cookies} from '../../services/cookies';
import {Button} from '../../ui/button/button';

@Component({
  selector: 'app-cookie-consent-bottom-sheet',
  imports: [
    Button
  ],
  templateUrl: './cookie-consent-bottom-sheet.html',
  styleUrl: './cookie-consent-bottom-sheet.scss',
  encapsulation: ViewEncapsulation.None,
  host : {
    'class': 'cookie-consent-bottom-sheet__wrapper',
    'animate.enter': 'cookie-consent-bottom-sheet__enter'
  }
})
export class CookieConsentBottomSheet implements OnInit {

  private readonly _cookies = inject(Cookies);
  private readonly _dialogRef = inject(DialogRef<CookieConsentBottomSheet>);
  private readonly _elementRef = inject(ElementRef<HTMLElement>);

  ngOnInit() {
    this._elementRef.nativeElement.addEventListener('animationend', (event: AnimationEvent) => {
      if (event.animationName.endsWith('__leave')) {
        this._dialogRef.close();
      }
    });
  }

  protected _rejectAllCookies() {

    this._cookies.rejectAll();
    this.close();
  }

  protected _acceptAllCookies() {

    this._cookies.acceptAll();
    this.close();
  }

  close() {
    this._elementRef.nativeElement.classList.add('cookie-consent-bottom-sheet__leave');
  }
}
