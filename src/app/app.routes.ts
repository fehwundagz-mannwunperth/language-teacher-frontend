import { Routes } from '@angular/router';

import { adminAuthChildGuard } from './core/guards/admin-auth.guard';

export const routes: Routes = [
  {
    path: 'studio-login',
    loadComponent: () =>
      import('./public/studio-login/studio-login.component').then((m) => m.StudioLoginComponent),
  },
  {
    path: 'studio',
    canActivateChild: [adminAuthChildGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'overview',
      },
      {
        path: 'overview',
        loadComponent: () =>
          import('./admin/studio-overview/studio-overview.component').then(
            (m) => m.StudioOverviewComponent,
          ),
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('./admin/studio-settings/studio-settings.component').then(
            (m) => m.StudioSettingsComponent,
          ),
      },
    ],
  },
  {
    path: 'admin',
    canActivateChild: [adminAuthChildGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard',
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./admin/dashboard/dashboard.component').then((m) => m.DashboardComponent),
      },
      {
        path: 'blog-editor',
        loadComponent: () =>
          import('./admin/blog-editor/blog-editor.component').then((m) => m.BlogEditorComponent),
      },
      {
        path: 'content-editor',
        loadComponent: () =>
          import('./admin/content-editor/content-editor.component').then(
            (m) => m.ContentEditorComponent,
          ),
      },
    ],
  },
  {
    path: '',
    loadComponent: () =>
      import('./core/layout/public-layout/public-layout.component').then(
        (m) => m.PublicLayoutComponent,
      ),
    children: [
      {
        path: '',
        pathMatch: 'full',
        loadComponent: () => import('./public/home/home.component').then((m) => m.HomeComponent),
      },
      {
        path: 'about',
        loadComponent: () => import('./public/about/about.component').then((m) => m.AboutComponent),
      },
      {
        path: 'lessons',
        loadComponent: () =>
          import('./public/lessons/lessons.component').then((m) => m.LessonsComponent),
      },
      {
        path: 'prices',
        loadComponent: () =>
          import('./public/prices/prices.component').then((m) => m.PricesComponent),
      },
      {
        path: 'calendar',
        loadComponent: () =>
          import('./public/calendar/calendar.component').then((m) => m.CalendarComponent),
      },
      {
        path: 'blog',
        loadComponent: () => import('./public/blog/blog.component').then((m) => m.BlogComponent),
      },
      {
        path: 'contact',
        loadComponent: () =>
          import('./public/contact/contact.component').then((m) => m.ContactComponent),
      },
      {
        path: 'terms-and-conditions',
        loadComponent: () =>
          import('./public/terms-and-conditions/terms-and-conditions.component').then(
            (m) => m.TermsAndConditionsComponent,
          ),
      },
      {
        path: 'privacy-policy',
        loadComponent: () =>
          import('./public/privacy-policy/privacy-policy.component').then(
            (m) => m.PrivacyPolicyComponent,
          ),
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
