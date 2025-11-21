import {InjectionToken} from '@angular/core';
import {Analytics as _Analytics} from 'firebase/analytics';
import {FirebaseApp as _FirebaseApp} from 'firebase/app';
import {AppCheck as _AppCheck} from 'firebase/app-check';
import {Auth as _Auth} from 'firebase/auth';
import {Firestore as _Firestore} from 'firebase/firestore';
import {Functions as _Functions} from 'firebase/functions';
import {FirebaseStorage as _FirebaseStorage} from 'firebase/storage';

export const FirebaseApp = new InjectionToken<_FirebaseApp>('FirebaseApp');
export const Auth = new InjectionToken<_Auth>('Auth');
export const AppCheck = new InjectionToken<_AppCheck>('AppCheck');
export const Firestore = new InjectionToken<_Firestore>('Firestore');
export const Functions = new InjectionToken<_Functions>('Functions');
export const FirebaseStorage = new InjectionToken<_FirebaseStorage>('FirebaseStorage');
export const Analytics = new InjectionToken<_Analytics>('Analytics');
