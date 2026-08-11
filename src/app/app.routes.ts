import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./layout/main-layout/main-layout.component').then(m => m.MainLayoutComponent),
    children: [
      // Root redirects straight to the student form — no landing page
      {
        path: '',
        redirectTo: 'student-form',
        pathMatch: 'full'
      },
      {
        path: 'student-form',
        loadComponent: () => import('./features/registration/registration-form.component').then(m => m.RegistrationFormComponent),
        title: 'Student Registration — Renaissance University'
      },
      {
        path: 'success',
        loadComponent: () => import('./features/certificate/registration-success.component').then(m => m.RegistrationSuccessComponent),
        title: 'Registration Successful — Renaissance University'
      },
      {
        path: 'certificate',
        loadComponent: () => import('./features/certificate/certificate-status.component').then(m => m.CertificateStatusComponent),
        title: 'Check Certificate — Renaissance University'
      }
    ]
  },
  {
    path: 'not-found',
    loadComponent: () => import('./features/not-found/not-found.component').then(m => m.NotFoundComponent),
    title: '404 — Page Not Found'
  },
  {
    path: '**',
    redirectTo: 'not-found'
  }
];
