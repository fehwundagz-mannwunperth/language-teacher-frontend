import { AsyncPipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';

import { AdminAuthService } from '../../auth/admin-auth.service';
import { LanguageCode, TranslationKey } from '../../i18n/language.model';
import { FooterInfoService } from '../../services/footer-info.service';
import { TranslationService } from '../../i18n/translation.service';

type NavItem = { labelKey: TranslationKey; path: string };

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
  private readonly translationService = inject(TranslationService);

  private readonly publicNavItems: NavItem[] = [
    { labelKey: 'nav.home', path: '/' },
    { labelKey: 'nav.about', path: '/about' },
    { labelKey: 'nav.lessons', path: '/lessons-services' },
    { labelKey: 'nav.prices', path: '/prices' },
    { labelKey: 'nav.calendar', path: '/calendar' },
    { labelKey: 'nav.blog', path: '/blog' },
    { labelKey: 'nav.contact', path: '/contact' },
  ];
  private readonly studioNavItem: NavItem = { labelKey: 'nav.studio', path: '/studio/overview' };

  protected readonly footerProviderInfo$ = this.footerInfoService.getProviderInfo();
  protected readonly languages = this.translationService.languages;
  protected readonly currentLanguageOption = this.translationService.currentLanguageOption;
  protected readonly navItems = computed(() =>
    this.adminAuthService.isLoggedIn()
      ? [...this.publicNavItems, this.studioNavItem]
      : this.publicNavItems,
  );
  protected readonly footerItems: { labelKey: TranslationKey; path: string }[] = [
    { labelKey: 'nav.home', path: '/' },
    { labelKey: 'nav.about', path: '/about' },
    { labelKey: 'nav.lessons', path: '/lessons-services' },
    { labelKey: 'nav.prices', path: '/prices' },
    { labelKey: 'nav.calendar', path: '/calendar' },
    { labelKey: 'nav.blog', path: '/blog' },
    { labelKey: 'nav.contact', path: '/contact' },
    { labelKey: 'nav.termsAndConditions', path: '/terms-and-conditions' },
    { labelKey: 'nav.privacyPolicy', path: '/privacy-policy' },
  ];

  protected t(key: TranslationKey): string {
    return this.translationService.translate(key);
  }

  protected setLanguage(language: LanguageCode): void {
    this.translationService.setLanguage(language);
  }
}
