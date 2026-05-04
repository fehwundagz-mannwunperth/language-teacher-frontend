import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

import { AdminAuthService } from '../../core/auth/admin-auth.service';
import { TranslationKey } from '../../core/i18n/language.model';
import { TranslationService } from '../../core/i18n/translation.service';

@Component({
  selector: 'app-studio-navigation',
  imports: [MatButtonModule, RouterLink, RouterLinkActive],
  templateUrl: './studio-navigation.component.html',
  styleUrl: './studio-navigation.component.scss',
})
export class StudioNavigationComponent {
  private readonly adminAuthService = inject(AdminAuthService);
  private readonly router = inject(Router);
  private readonly translationService = inject(TranslationService);

  protected readonly studioNavItems: { labelKey: TranslationKey; path: string }[] = [
    { labelKey: 'studioOverview.title', path: '/studio/overview' },
    { labelKey: 'nav.homeContent', path: '/studio/home-content' },
    { labelKey: 'nav.lessons', path: '/studio/lessons-services' },
    { labelKey: 'nav.blog', path: '/studio/blog' },
    { labelKey: 'nav.settings', path: '/studio/settings' },
  ];

  protected logout(): void {
    this.adminAuthService.logout();
    void this.router.navigate(['/']);
  }

  protected t(key: TranslationKey): string {
    return this.translationService.translate(key);
  }
}
