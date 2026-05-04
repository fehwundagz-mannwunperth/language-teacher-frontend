import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';

import { AdminAuthService } from '../../auth/admin-auth.service';
import { LanguageCode, TranslationKey } from '../../i18n/language.model';
import { FooterInfoService } from '../../services/footer-info.service';
import { TranslationService } from '../../i18n/translation.service';

@Component({
  selector: 'app-public-layout',
  imports: [
    AsyncPipe,
    MatButtonModule,
    MatMenuModule,
    MatToolbarModule,
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
  ],
  templateUrl: './public-layout.component.html',
  styleUrl: './public-layout.component.scss',
})
export class PublicLayoutComponent {
  private readonly adminAuthService = inject(AdminAuthService);
  private readonly footerInfoService = inject(FooterInfoService);
  private readonly router = inject(Router);
  private readonly translationService = inject(TranslationService);

  protected readonly footerProviderInfo$ = this.footerInfoService.getProviderInfo();
  protected readonly isAdminLoggedIn = this.adminAuthService.isLoggedIn;
  protected readonly languages = this.translationService.languages;
  protected readonly currentLanguageOption = this.translationService.currentLanguageOption;
  protected readonly navItems: { labelKey: TranslationKey; path: string }[] = [
    { labelKey: 'nav.home', path: '/' },
    { labelKey: 'nav.about', path: '/about' },
    { labelKey: 'nav.lessons', path: '/lessons' },
    { labelKey: 'nav.prices', path: '/prices' },
    { labelKey: 'nav.calendar', path: '/calendar' },
    { labelKey: 'nav.blog', path: '/blog' },
    { labelKey: 'nav.contact', path: '/contact' },
  ];
  protected readonly footerItems: { labelKey: TranslationKey; path: string }[] = [
    ...this.navItems,
    { labelKey: 'nav.termsAndConditions', path: '/terms-and-conditions' },
    { labelKey: 'nav.privacyPolicy', path: '/privacy-policy' },
  ];

  protected t(key: TranslationKey): string {
    return this.translationService.translate(key);
  }

  protected setLanguage(language: LanguageCode): void {
    this.translationService.setLanguage(language);
  }

  protected logout(): void {
    this.adminAuthService.logout();
    void this.router.navigate(['/']);
  }
}
