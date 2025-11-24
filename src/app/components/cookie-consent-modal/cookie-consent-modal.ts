import {DialogRef} from '@angular/cdk/dialog';
import {Component, ElementRef, inject, OnInit, ViewEncapsulation} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {Cookies} from '../../services/cookies';
import {Button} from '../../ui/button/button';
import {SlideToggle} from '../../ui/slide-toggle/slide-toggle';

@Component({
  selector: 'app-cookie-consent-modal',
  imports: [
    SlideToggle,
    FormsModule,
    ReactiveFormsModule,
    Button
  ],
  templateUrl: './cookie-consent-modal.html',
  styleUrl: './cookie-consent-modal.scss',
  encapsulation: ViewEncapsulation.None,
  host: {
    'class': 'cookie-consent-modal__wrapper',
    'animate.enter': 'cookie-consent-modal__enter'
  }
})
export class CookieConsentModal implements OnInit {

  private readonly _dialogRef = inject(DialogRef<CookieConsentModal>);
  private readonly _cookies = inject(Cookies);
  private readonly _elementRef = inject(ElementRef<HTMLElement>);

  protected readonly _cookieConsentForm = new FormGroup({
    necessary: new FormControl(true, [Validators.requiredTrue]),
    analytics: new FormControl(false)
  });

  ngOnInit() {

    this._elementRef.nativeElement.addEventListener('animationend', (event: AnimationEvent) => {
      if (event.animationName.endsWith('__leave')) {
        this._dialogRef.close();
      }
    });

    this._cookieConsentForm.get('necessary')?.disable({emitEvent: false});

    if (this._cookies.get('cookie-consent-analytics') === 'true') {
      this._cookieConsentForm.patchValue({analytics: true});
    }
  }

  protected _onSubmit() {

    if (this._cookieConsentForm.invalid) {
      return;
    }

    this._acceptSelectedCookies();
  }

  protected _rejectAllCookies() {

    this._cookies.rejectAll();

    this._cookies.set('cookie-consent', 'true', {
      expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
    });

    this.close();
  }

  protected _acceptAllCookies() {

    this._cookies.acceptAll();
    this.close();
  }

  protected _acceptSelectedCookies() {

    if (this._cookieConsentForm.get('analytics')?.value) {
      this._cookies.acceptAnalyticsCookies();
    } else {
      this._cookies.declineAnalyticsCookies();
    }

    this.close();
  }

  close() {
    this._elementRef.nativeElement.classList.add('cookie-consent-modal__leave');
  }
}
