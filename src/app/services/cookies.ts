import {isPlatformServer} from '@angular/common';
import {inject, Injectable, PLATFORM_ID} from '@angular/core';
import {ConsentSettings} from '@firebase/analytics';
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

    this.turnOffAutoBottomSheet();
    this.declineAnalyticsCookies();
  }

  acceptAll() {

    this.turnOffAutoBottomSheet()
    this.acceptAnalyticsCookies();
  }

  deleteAnalyticsCookies() {

    const cookies = document.cookie.split(';');

    const analyticsCookies = cookies
      .map(c => c.split('=')[0].trim())
      .filter(name => /^_ga|^_gid|^_gat/.test(name));

    analyticsCookies.forEach((name) => {
      this.delete(name);
    });
  }

  acceptAnalyticsCookies() {

    this.set('cookie-consent-analytics', 'true', {
      expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
    });

    this.setConsent({
      analytics_storage: 'granted'
    });
  }

  declineAnalyticsCookies() {

    this.set('cookie-consent-analytics', 'false', {
      expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
    });

    this.setConsent({
      analytics_storage: 'denied'
    });

    this.deleteAnalyticsCookies();
  }

  setConsent(consent: ConsentSettings) {
    setConsent(consent);
  }

  turnOffAutoBottomSheet() {
    this.set('cookie-consent', 'true', {
      expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
    });
  }
}
