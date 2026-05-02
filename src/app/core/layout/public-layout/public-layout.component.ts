import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';

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
  private readonly footerInfoService = inject(FooterInfoService);
  private readonly translationService = inject(TranslationService);

  protected readonly footerProviderInfo$ = this.footerInfoService.getProviderInfo();
  protected readonly languages = this.translationService.languages;
  protected readonly currentLanguageOption = this.translationService.currentLanguageOption;
  protected readonly navItems: { labelKey: TranslationKey; path: string }[] = [
    { labelKey: 'nav.home', path: '/' },
    { labelKey: 'nav.about', path: '/about' },
    { labelKey: 'nav.lessons', path: '/lessons' },
    { labelKey: 'nav.prices', path: '/prices' },
    { labelKey: 'nav.blog', path: '/blog' },
    { labelKey: 'nav.contact', path: '/contact' },
  ];

  protected t(key: TranslationKey): string {
    return this.translationService.translate(key);
  }

  protected setLanguage(language: LanguageCode): void {
    this.translationService.setLanguage(language);
  }
}
