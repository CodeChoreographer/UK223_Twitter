import { Routes } from '@angular/router';

export const appRoutes: Routes = [
  {
    path: '',
    redirectTo: '',
    pathMatch: 'full'
  },
  {
    path: '**',
    loadComponent: () =>
      import('./error-page/error-page.component').then(m => m.ErrorPageComponent),
    data: {
      title: 'Seite nicht gefunden',
      errorCode: '404',
      errorMessage: 'Seite nicht gefunden'
    }
  }
];
