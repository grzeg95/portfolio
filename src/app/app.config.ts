import {isPlatformServer} from '@angular/common';
import {
  ApplicationConfig,
  CSP_NONCE,
  inject,
  PLATFORM_ID,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
  REQUEST_CONTEXT
} from '@angular/core';
import {provideClientHydration, withEventReplay} from '@angular/platform-browser';
import {CookieConsentBottomSheet} from './components/cookie-consent-bottom-sheet/cookie-consent-bottom-sheet';
import {provideFirebase} from './config/firebase.config';
import {BottomSheet} from './services/bottom-sheet';
import {Cookies} from './services/cookies';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideClientHydration(withEventReplay()),
    provideFirebase(),
    {
      provide: CSP_NONCE,
      useFactory: () => {

        const platformId = inject(PLATFORM_ID);
        const reqContext = inject(REQUEST_CONTEXT) as {nonce: string};

        if (isPlatformServer(platformId) && reqContext) {
          return reqContext.nonce;
        }

        return null;
      }
    },
    provideAppInitializer(() => {

      const platformId = inject(PLATFORM_ID);

      if (isPlatformServer(platformId)) return;

      const cookies = inject(Cookies);
      const bottomSheet = inject(BottomSheet);

      const cookieConsent = cookies.get('cookieConsent');

      if (cookieConsent !== 'true') {
        cookies.rejectAll();
        bottomSheet.open(CookieConsentBottomSheet);
      }
    })
  ]
};
