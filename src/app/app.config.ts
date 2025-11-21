import {ApplicationConfig, provideBrowserGlobalErrorListeners} from '@angular/core';
import {provideClientHydration, withEventReplay} from '@angular/platform-browser';
import {provideFirebase} from './config/firebase.config';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideClientHydration(withEventReplay()),
    provideFirebase()
  ]
};
