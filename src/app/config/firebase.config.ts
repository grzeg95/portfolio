import {isPlatformBrowser} from '@angular/common';
import {EnvironmentProviders, inject, makeEnvironmentProviders, PLATFORM_ID, Provider} from '@angular/core';
import {getAnalytics} from 'firebase/analytics';
import {initializeApp} from 'firebase/app';
import {initializeAppCheck, ReCaptchaEnterpriseProvider} from 'firebase/app-check';
import {connectAuthEmulator, getAuth} from 'firebase/auth';
import {connectFirestoreEmulator, getFirestore} from 'firebase/firestore';
import {connectFunctionsEmulator, getFunctions} from 'firebase/functions';
import {connectStorageEmulator, getStorage} from 'firebase/storage';
import {environment} from '../../environments/environment';
import {Analytics, AppCheck, Auth, FirebaseApp, FirebaseStorage, Firestore, Functions} from '../tokens/firebase.tokens';

export function provideFirebase(): EnvironmentProviders {

  return makeEnvironmentProviders([
    {
      provide: 'FIREBASE_INIT',
      useFactory: () => {

        const platformId = inject(PLATFORM_ID);

        if (!environment.production && isPlatformBrowser(platformId)) {
          // @ts-expect-error
          window.FIREBASE_APPCHECK_DEBUG_TOKEN = true;
        }

        const providers: Provider[] = [];

        // Firebase app

        const app = initializeApp(environment.firebase);

        providers.push({
          provide: FirebaseApp,
          useValue: app
        });

        // Firebase auth

        const auth = getAuth();

        if (!environment.production && isPlatformBrowser(platformId)) {
          connectAuthEmulator(auth, `${environment.emulators.auth.protocol}://${environment.emulators.auth.host}:${environment.emulators.auth.port}`);
        }

        providers.push({
          provide: Auth,
          useValue: auth
        });

        // Firebase app check

        const provider = new ReCaptchaEnterpriseProvider(environment.recaptchaEnterprise);

        const appCheck = initializeAppCheck(undefined, {
          provider,
          isTokenAutoRefreshEnabled: true
        });

        providers.push({
          provide: AppCheck,
          useValue: appCheck
        });

        // Firebase firestore

        const firestore = getFirestore();

        if (!environment.production && isPlatformBrowser(platformId)) {
          connectFirestoreEmulator(firestore, environment.emulators.firestore.host, environment.emulators.firestore.port);
        }

        providers.push({
          provide: Firestore,
          useValue: firestore
        });

        // Firebase functions

        const functions = getFunctions(app, 'europe-central2');

        if (!environment.production) {
          connectFunctionsEmulator(functions, environment.emulators.functions.host, environment.emulators.functions.port);
        }

        providers.push({
          provide: Functions,
          useValue: functions
        });

        // Firebase storage

        const storage = getStorage();

        if (!environment.production) {
          connectStorageEmulator(storage, environment.emulators.storage.host, environment.emulators.storage.port);
        }

        providers.push({
          provide: FirebaseStorage,
          useValue: storage
        });

        // Analytics

        const analytics = getAnalytics(app);

        providers.push({
          provide: Analytics,
          useValue: analytics
        });

        // return providers

        return providers;
      }
    }
  ]);
}
