import {Component, inject, ViewEncapsulation} from '@angular/core';
import {BottomSheet} from '../../services/bottom-sheet';
import {CookieConsentBottomSheet} from '../cookie-consent-bottom-sheet/cookie-consent-bottom-sheet';

@Component({
  selector: 'app-footer',
  imports: [],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
  encapsulation: ViewEncapsulation.None,
  host: {
    'class': 'footer'
  }
})
export class Footer {

  private readonly _bottomSheet = inject(BottomSheet);

  protected openCookieBottomSheet($event: PointerEvent) {

    $event.preventDefault();
    $event.stopPropagation();

    this._bottomSheet.open(CookieConsentBottomSheet);
  }
}
