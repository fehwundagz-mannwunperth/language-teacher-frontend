import { Routes } from '@angular/router';

import { adminAuthChildGuard } from './core/guards/admin-auth.guard';

export const routes: Routes = [
  {
    path: 'studio-login',
    loadComponent: () =>
      import('./public/studio-login/studio-login.component').then((m) => m.StudioLoginComponent),
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
        redirectTo: 'lessons-services',
        pathMatch: 'full',
      },
      {
        path: 'lessons-services',
        loadComponent: () =>
          import('./public/lessons/lessons.component').then((m) => m.LessonsComponent),
      },
      {
        path: 'lessons-services/:id',
        loadComponent: () =>
          import('./public/lesson-service-detail/lesson-service-detail.component').then(
            (m) => m.LessonServiceDetailComponent,
          ),
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
        path: 'blog/:id',
        loadComponent: () =>
          import('./public/blog-detail/blog-detail.component').then((m) => m.BlogDetailComponent),
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
          {
            path: 'home-content',
            loadComponent: () =>
              import('./admin/home-content/home-content.component').then(
                (m) => m.HomeContentComponent,
              ),
          },
          {
            path: 'lessons-services',
            loadComponent: () =>
              import('./admin/lesson-services/lesson-services-admin.component').then(
                (m) => m.LessonServicesAdminComponent,
              ),
          },
          {
            path: 'blog',
            loadComponent: () =>
              import('./admin/blog-editor/blog-editor.component').then((m) => m.BlogEditorComponent),
          },
          {
            path: 'testimonials',
            loadComponent: () =>
              import('./admin/testimonials/testimonials-admin.component').then(
                (m) => m.TestimonialsAdminComponent,
              ),
          },
        ],
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
