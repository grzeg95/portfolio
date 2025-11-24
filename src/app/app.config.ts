import {isPlatformBrowser, isPlatformServer} from '@angular/common';
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
import {getAnalytics} from 'firebase/analytics';
import {initializeApp} from 'firebase/app';
import {initializeAppCheck, ReCaptchaEnterpriseProvider} from 'firebase/app-check';
import {connectAuthEmulator, getAuth} from 'firebase/auth';
import {connectFirestoreEmulator, getFirestore} from 'firebase/firestore';
import {connectFunctionsEmulator, getFunctions} from 'firebase/functions';
import {connectStorageEmulator, getStorage} from 'firebase/storage';
import {environment} from '../environments/environment';
import {CookieConsentBottomSheet} from './components/cookie-consent-bottom-sheet/cookie-consent-bottom-sheet';
import {BottomSheet} from './services/bottom-sheet';
import {Cookies} from './services/cookies';
import {Analytics, AppCheck, Auth, FirebaseApp, FirebaseStorage, Firestore, Functions} from './tokens/firebase.tokens';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideClientHydration(withEventReplay()),
    provideAppInitializer(() => {

      const platformId = inject(PLATFORM_ID);

      if (isPlatformServer(platformId)) return;

      const cookies = inject(Cookies);
      const bottomSheet = inject(BottomSheet);

      const cookieConsent = cookies.get('cookieConsent');

      if (cookieConsent !== 'true') {
        cookies.rejectAll();
        bottomSheet.open(CookieConsentBottomSheet, {
          disableClose: true
        });
      }
    }),
    provideAppInitializer(() => {

      const platformId = inject(PLATFORM_ID);

      if (!environment.production && isPlatformBrowser(platformId)) {
        // @ts-expect-error
        window.FIREBASE_APPCHECK_DEBUG_TOKEN = true;
      }
    }),
    {
      provide: FirebaseApp,
      useValue: initializeApp(environment.firebase)
    },
    {
      provide: Auth,
      useFactory: () => {

        const platformId = inject(PLATFORM_ID);

        const auth = getAuth();

        if (!environment.production && isPlatformBrowser(platformId)) {
          connectAuthEmulator(auth, `${environment.emulators.auth.protocol}://${environment.emulators.auth.host}:${environment.emulators.auth.port}`);
        }

        return auth;
      }
    },
    {
      provide: AppCheck,
      useFactory: () => {

        const provider = new ReCaptchaEnterpriseProvider(environment.recaptchaEnterprise);

        const appCheck = initializeAppCheck(undefined, {
          provider,
          isTokenAutoRefreshEnabled: true
        });

        return appCheck;
      }
    },
    {
      provide: Firestore,
      useFactory: () => {

        const platformId = inject(PLATFORM_ID);

        const firestore = getFirestore();

        if (!environment.production && isPlatformBrowser(platformId)) {
          connectFirestoreEmulator(firestore, environment.emulators.firestore.host, environment.emulators.firestore.port);
        }
      }
    },
    {
      provide: Functions,
      useFactory: () => {

        const platformId = inject(PLATFORM_ID);
        const firebaseApp = inject(FirebaseApp);

        const functions = getFunctions(firebaseApp, 'europe-central2');

        if (!environment.production && isPlatformBrowser(platformId)) {
          connectFunctionsEmulator(functions, environment.emulators.functions.host, environment.emulators.functions.port);
        }

        return functions;
      }
    },
    {
      provide: FirebaseStorage,
      useFactory: () => {

        const platformId = inject(PLATFORM_ID);

        const storage = getStorage();

        if (!environment.production && isPlatformBrowser(platformId)) {
          connectStorageEmulator(storage, environment.emulators.storage.host, environment.emulators.storage.port);
        }

        return storage;
      }
    },
    {
      provide: Analytics,
      useFactory: () => {

        const platformId = inject(PLATFORM_ID);
        const cookies = inject(Cookies);

        if (isPlatformBrowser(platformId)) {

          cookies.rejectAll();

          return getAnalytics();
        }

        return null;
      }
    },
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
