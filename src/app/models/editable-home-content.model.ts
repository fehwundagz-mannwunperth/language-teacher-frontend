import { LanguageCode } from '../core/i18n/language.model';

export type HomeSectionKey = 'hero' | 'teacherIntro' | 'lessonsServices' | 'testimonials';

export interface EditableHomeSectionContent {
  key: HomeSectionKey;
  label: string;
  title: string;
  summary: string;
  primaryButtonText?: string;
  secondaryButtonText?: string;
}

export type EditableHomeSections = Record<HomeSectionKey, EditableHomeSectionContent>;

export interface EditableHomeContentState {
  sectionsByLanguage: Record<LanguageCode, EditableHomeSections>;
  sectionOrder: HomeSectionKey[];
  heroImageUrl: string;
}

export interface LocalizedHomeContent {
  sections: EditableHomeSections;
  sectionOrder: HomeSectionKey[];
  heroImageUrl: string;
}
