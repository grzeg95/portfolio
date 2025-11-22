import {isPlatformServer} from '@angular/common';
import {
  ApplicationConfig,
  CSP_NONCE,
  inject,
  PLATFORM_ID,
  provideBrowserGlobalErrorListeners,
  REQUEST_CONTEXT
} from '@angular/core';
import {provideClientHydration, withEventReplay} from '@angular/platform-browser';
import {provideFirebase} from './config/firebase.config';

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
    }
  ]
};
