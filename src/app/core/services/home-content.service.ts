import { Injectable, computed, inject, signal } from '@angular/core';

import {
  EditableHomeContentState,
  EditableHomeSections,
  HomeSectionKey,
  LocalizedHomeContent,
} from '../../models/editable-home-content.model';
import { LanguageCode } from '../i18n/language.model';
import { TranslationService } from '../i18n/translation.service';

const STORAGE_KEY = 'language-teacher-home-content';
const HERO_IMAGE_URL = '/images/kun_brigitta_teacher.jpg';
const DEFAULT_SECTION_ORDER: HomeSectionKey[] = [
  'hero',
  'teacherIntro',
  'lessonsServices',
  'testimonials',
];

const DEFAULT_SECTIONS_BY_LANGUAGE: Record<LanguageCode, EditableHomeSections> = {
  hu: {
    hero: {
      key: 'hero',
      label: 'Budapest és online',
      title: 'Magán angolórák magabiztos, gyakorlati kommunikációhoz',
      summary:
        'Barátságos, célorientált angolórák felnőtteknek és tinédzsereknek, akik szeretnének bátrabban beszélni, pontosabban használni a nyelvtant és valós helyzetekben fejlődni.',
      primaryButtonText: 'Próbaóra foglalása',
      secondaryButtonText: '\u00d3r\u00e1k \u00e9s szolg\u00e1ltat\u00e1sok megtekint\u00e9se',
    },
    teacherIntro: {
      key: 'teacherIntro',
      label: 'Ismerd meg a tanárt',
      title: 'Kun Brigitta',
      summary:
        'Az órák célalapúak és könnyen követhetők: kijelölünk egy fókuszt, valós példákkal gyakorlunk, majd világos következő lépésekkel zárunk az önálló tanuláshoz.',
    },
    lessonsServices: {
      key: 'lessonsServices',
      label: 'Órák és szolgáltatások',
      title: 'Célzott támogatás valódi kommunikációhoz',
      summary:
        'Válassz óratípust most, később ugyanez az oldal Spring Boot backendből is olvashatja a tartalmat.',
    },
    testimonials: {
      key: 'testimonials',
      label: 'Tanulói visszajelzések',
      title: 'Átlátható, nyugodt órák gyakorlati fejlődéssel',
      summary: '',
    },
  },
  en: {
    hero: {
      key: 'hero',
      label: 'Budapest and online',
      title: 'Private English lessons for confident, practical communication',
      summary:
        'Practical, friendly English lessons for adults and teens who want clearer speaking, stronger grammar, and more confidence in real situations.',
      primaryButtonText: 'Book a trial lesson',
      secondaryButtonText: 'View lessons & services',
    },
    teacherIntro: {
      key: 'teacherIntro',
      label: 'Meet your teacher',
      title: 'Brigitta Kun',
      summary:
        'Lessons are goal-based and easy to follow: we agree on a focus, practise with realistic examples, and finish with clear next steps for your independent study.',
    },
    lessonsServices: {
      key: 'lessonsServices',
      label: 'Lessons and services',
      title: 'Focused support for real communication',
      summary:
        'Choose a lesson type now, then later the same page can read lesson content from Spring Boot.',
    },
    testimonials: {
      key: 'testimonials',
      label: 'Student feedback',
      title: 'Clear, calm lessons with practical progress',
      summary: '',
    },
  },
};

const DEFAULT_HOME_CONTENT_STATE: EditableHomeContentState = {
  sectionsByLanguage: DEFAULT_SECTIONS_BY_LANGUAGE,
  sectionOrder: DEFAULT_SECTION_ORDER,
  heroImageUrl: HERO_IMAGE_URL,
};

@Injectable({ providedIn: 'root' })
export class HomeContentService {
  private readonly translationService = inject(TranslationService);
  private readonly state = signal<EditableHomeContentState>(this.readStoredState());

  readonly currentHomeContent = computed<LocalizedHomeContent>(() =>
    this.getPublicHomeContent(this.translationService.currentLanguage()),
  );

  public getPublicHomeContent(language: LanguageCode): LocalizedHomeContent {
    // Future Spring Boot endpoint: GET /api/public/home-content
    const state = this.state();
    return {
      sections: state.sectionsByLanguage[language],
      sectionOrder: state.sectionOrder,
      heroImageUrl: state.heroImageUrl,
    };
  }

  public getAdminHomeContent(language: LanguageCode): LocalizedHomeContent {
    // Future Spring Boot endpoint: GET /api/admin/home-content
    return this.getPublicHomeContent(language);
  }

  public saveAdminHomeContent(language: LanguageCode, sections: EditableHomeSections): void {
    // Future Spring Boot endpoint: PUT /api/admin/home-content
    this.patchState({
      sectionsByLanguage: {
        ...this.state().sectionsByLanguage,
        [language]: sections,
      },
    });
  }

  public saveSectionOrder(sectionOrder: HomeSectionKey[]): void {
    // Future Spring Boot endpoint: PUT /api/admin/home-section-order
    const sanitizedOrder = this.normalizeSectionOrder(sectionOrder);
    this.patchState({ sectionOrder: sanitizedOrder });
  }

  public saveHeroImage(heroImageUrl: string): void {
    // Future Spring Boot endpoint: PUT /api/admin/home/hero-image
    this.patchState({ heroImageUrl });
  }

  private patchState(partialState: Partial<EditableHomeContentState>): void {
    const nextState = {
      ...this.state(),
      ...partialState,
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState));
    this.state.set(nextState);
  }

  private readStoredState(): EditableHomeContentState {
    const storedState = localStorage.getItem(STORAGE_KEY);

    if (!storedState) {
      return DEFAULT_HOME_CONTENT_STATE;
    }

    try {
      const parsedState = JSON.parse(storedState) as Partial<EditableHomeContentState>;

      const sectionsByLanguage = {
        hu: {
          ...DEFAULT_SECTIONS_BY_LANGUAGE.hu,
          ...parsedState.sectionsByLanguage?.hu,
        },
        en: {
          ...DEFAULT_SECTIONS_BY_LANGUAGE.en,
          ...parsedState.sectionsByLanguage?.en,
        },
      };

      return {
        sectionsByLanguage: {
          hu: {
            ...sectionsByLanguage.hu,
            hero: this.normalizeHeroButtons('hu', sectionsByLanguage.hu.hero),
          },
          en: {
            ...sectionsByLanguage.en,
            hero: this.normalizeHeroButtons('en', sectionsByLanguage.en.hero),
          },
        },
        sectionOrder: this.normalizeSectionOrder(parsedState.sectionOrder ?? DEFAULT_SECTION_ORDER),
        heroImageUrl: parsedState.heroImageUrl || HERO_IMAGE_URL,
      };
    } catch {
      return DEFAULT_HOME_CONTENT_STATE;
    }
  }

  private normalizeSectionOrder(sectionOrder: HomeSectionKey[]): HomeSectionKey[] {
    const movableSections = DEFAULT_SECTION_ORDER.filter((sectionKey) => sectionKey !== 'hero');
    const savedMovableSections = sectionOrder.filter(
      (sectionKey) => sectionKey !== 'hero' && movableSections.includes(sectionKey),
    );
    const missingSections = movableSections.filter(
      (sectionKey) => !savedMovableSections.includes(sectionKey),
    );

    return ['hero', ...savedMovableSections, ...missingSections];
  }

  private normalizeHeroButtons(
    language: LanguageCode,
    hero: EditableHomeSections['hero'],
  ): EditableHomeSections['hero'] {
    const oldSecondaryButtonText =
      language === 'hu' ? '\u00d3r\u00e1k megtekint\u00e9se' : 'View lessons';
    const nextSecondaryButtonText =
      language === 'hu'
        ? '\u00d3r\u00e1k \u00e9s szolg\u00e1ltat\u00e1sok megtekint\u00e9se'
        : 'View lessons & services';

    if (hero.secondaryButtonText !== oldSecondaryButtonText) {
      return hero;
    }

    return {
      ...hero,
      secondaryButtonText: nextSecondaryButtonText,
    };
  }
}
