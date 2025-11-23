import {isPlatformServer} from '@angular/common';
import {inject, Injectable, PLATFORM_ID} from '@angular/core';
import {setConsent} from 'firebase/analytics';

@Injectable({
  providedIn: 'root',
})
export class Cookies {

  private platformId = inject(PLATFORM_ID);

  get(name: string) {

    if (isPlatformServer(this.platformId)) return '';

    const cookies = document.cookie.split('; ');
    const found = cookies.find(c => c.startsWith(name + '='));
    return found ? decodeURIComponent(found.split('=')[1]) : '';
  }

  set(
    name: string,
    value: string,
    options: {
      path?: string;
      secure?: boolean;
      sameSite?: 'Lax' | 'Strict' | 'None';
      expires?: string | Date;
    } = {
      path: '/'
    }
  ) {

    if (isPlatformServer(this.platformId)) return;

    let cookieStr = `${name}=${encodeURIComponent(value)};`;

    if (options.path) cookieStr += ` path=${options.path};`;
    if (options.secure) cookieStr += ` secure;`;
    if (options.sameSite) cookieStr += ` samesite=${options.sameSite};`;
    if (options.expires) {
      const exp = typeof options.expires === 'string' ? options.expires : options.expires.toUTCString();
      cookieStr += ` expires=${exp};`;
    }

    document.cookie = cookieStr;
  }

  delete(name: string, path: string = '/') {

    if (isPlatformServer(this.platformId)) return;

    document.cookie = `${name}=; path=${path}; expires=Thu, 01 Jan 1970 00:00:00 GMT;`;
  }

  rejectAll() {
    setConsent({
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
      analytics_storage: 'denied',
      functionality_storage: 'granted',
      personalization_storage: 'denied',
      security_storage: 'granted'
    });
  }

  acceptAll() {
    setConsent({
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
      analytics_storage: 'granted',
      functionality_storage: 'granted',
      personalization_storage: 'denied',
      security_storage: 'granted'
    });
  }
}
