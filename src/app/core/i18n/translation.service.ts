import { Injectable, computed, signal } from '@angular/core';

import { EN_TRANSLATIONS } from './translations.en';
import { HU_TRANSLATIONS } from './translations.hu';
import { LanguageCode, LanguageOption, TranslationKey, Translations } from './language.model';

const STORAGE_KEY = 'language-teacher-language';

const TRANSLATIONS: Record<LanguageCode, Translations> = {
  hu: HU_TRANSLATIONS,
  en: EN_TRANSLATIONS,
};

@Injectable({ providedIn: 'root' })
export class TranslationService {
  readonly languages: LanguageOption[] = [
    { code: 'hu', label: 'Magyar', flag: '🇭🇺' },
    { code: 'en', label: 'English', flag: '🇬🇧' },
  ];

  private readonly language = signal<LanguageCode>(this.readInitialLanguage());

  readonly currentLanguage = this.language.asReadonly();
  readonly currentLanguageOption = computed(
    () => this.languages.find((language) => language.code === this.currentLanguage()) ?? this.languages[0],
  );

  public setLanguage(language: LanguageCode): void {
    this.language.set(language);
    localStorage.setItem(STORAGE_KEY, language);
  }

  public translate(key: TranslationKey): string {
    return TRANSLATIONS[this.currentLanguage()][key] ?? EN_TRANSLATIONS[key];
  }

  private readInitialLanguage(): LanguageCode {
    const savedLanguage = localStorage.getItem(STORAGE_KEY);
    return savedLanguage === 'en' || savedLanguage === 'hu' ? savedLanguage : 'hu';
  }
}
