import {Route} from '@angular/router';
import {homePageResolver} from './pages/home-page/home-page.resolver';

export const appRoutes: Route[] = [
  {
    path: '',
    resolve: {
      homePage: homePageResolver
    },
    loadComponent: () => import('./pages/home-page/home-page').then(m => m.HomePage)
  }
];
