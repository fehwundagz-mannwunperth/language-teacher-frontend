import { Injectable, signal } from '@angular/core';

import { LessonServiceDraft, LessonServiceItem } from '../../models/lesson-service.model';

const STORAGE_KEY = 'language-teacher-lesson-services';
export const MAX_LESSON_SERVICE_ITEMS = 6;
export const LESSON_SERVICE_SUMMARY_MAX_LENGTH = 100;

const DEFAULT_LESSON_SERVICES: LessonServiceItem[] = [
  {
    id: 'conversation-english',
    label: 'A2-C1 / 60 MIN',
    title: 'Conversation English',
    summary: 'Guided speaking practice with vocabulary, pronunciation, and natural phrases.',
    content:
      'Build confidence through guided conversation practice. Lessons focus on natural phrasing, useful vocabulary, pronunciation, and the kind of speaking situations you actually meet in everyday life.',
    displayOrder: 1,
  },
  {
    id: 'exam-preparation',
    label: 'B1-C1 / 90 MIN',
    title: 'Exam Preparation',
    summary: 'Focused preparation for exams, certificates, and interviews.',
    content:
      'Prepare with clear goals, realistic tasks, and practical feedback. We can work on speaking, writing, grammar, vocabulary, and exam strategy based on the certificate or school exam you are targeting.',
    displayOrder: 2,
  },
  {
    id: 'business-english',
    label: 'BUSINESS / 90 MIN',
    title: 'Business English',
    summary: 'Meetings, presentations, emails, and confidence for international work.',
    content:
      'Practise workplace communication with real examples from meetings, presentations, emails, interviews, and negotiations. Lessons are practical and can be adapted to your role and industry.',
    displayOrder: 3,
  },
  {
    id: 'grammar-reset',
    label: 'A2-B2 / 60 MIN',
    title: 'Grammar Reset',
    summary: 'Clear grammar support with practice you can use in speaking and writing.',
    content:
      'Review grammar in a calm, structured way. Each lesson connects rules to examples, speaking tasks, and written practice so grammar becomes easier to use, not only easier to understand.',
    displayOrder: 4,
  },
];

@Injectable({ providedIn: 'root' })
export class LessonServiceService {
  private readonly items = signal<LessonServiceItem[]>(this.readStoredItems());

  readonly lessonServices = this.items.asReadonly();

  getPublicLessonServices(): LessonServiceItem[] {
    // Future Spring Boot endpoint: GET /api/public/lesson-services
    return this.items();
  }

  getPublicLessonServiceById(id: string): LessonServiceItem | undefined {
    // Future Spring Boot endpoint: GET /api/public/lesson-services/{id}
    return this.items().find((item) => item.id === id);
  }

  getAdminLessonServices(): LessonServiceItem[] {
    // Future Spring Boot endpoint: GET /api/admin/lesson-services
    return this.items();
  }

  createLessonService(draft: LessonServiceDraft): LessonServiceItem {
    // Future Spring Boot endpoint: POST /api/admin/lesson-services
    const currentItems = this.items();

    if (currentItems.length >= MAX_LESSON_SERVICE_ITEMS) {
      throw new Error('Maximum lesson/service item count reached.');
    }

    this.validateDraft(draft);

    const nextItem: LessonServiceItem = {
      ...this.sanitizeDraft(draft),
      id: this.createId(draft.title),
      displayOrder: currentItems.length + 1,
    };

    this.persist([...currentItems, nextItem]);
    return nextItem;
  }

  updateLessonService(id: string, draft: LessonServiceDraft): LessonServiceItem {
    // Future Spring Boot endpoint: PUT /api/admin/lesson-services/{id}
    this.validateDraft(draft);

    const currentItems = this.items();
    const existingItem = currentItems.find((item) => item.id === id);

    if (!existingItem) {
      throw new Error('Lesson/service item was not found.');
    }

    const nextItem: LessonServiceItem = {
      ...existingItem,
      ...this.sanitizeDraft(draft),
      displayOrder: existingItem.displayOrder,
    };

    this.persist(currentItems.map((item) => (item.id === id ? nextItem : item)));
    return nextItem;
  }

  deleteLessonService(id: string): void {
    // Future Spring Boot endpoint: DELETE /api/admin/lesson-services/{id}
    const nextItems = this.items().filter((item) => item.id !== id);

    if (nextItems.length === this.items().length) {
      throw new Error('Lesson/service item was not found.');
    }

    this.persist(nextItems);
  }

  reorderLessonServices(ids: string[]): void {
    // Future Spring Boot endpoint: PUT /api/admin/lesson-services/order
    const currentItems = this.items();
    const orderedItems = ids
      .map((id) => currentItems.find((item) => item.id === id))
      .filter((item): item is LessonServiceItem => Boolean(item));
    const missingItems = currentItems.filter((item) => !ids.includes(item.id));

    this.persist([...orderedItems, ...missingItems]);
  }

  private persist(items: LessonServiceItem[]): void {
    const normalizedItems = this.normalizeItems(items);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(normalizedItems));
    this.items.set(normalizedItems);
  }

  private readStoredItems(): LessonServiceItem[] {
    const storedItems = localStorage.getItem(STORAGE_KEY);

    if (!storedItems) {
      return this.normalizeItems(DEFAULT_LESSON_SERVICES);
    }

    try {
      const parsedItems = JSON.parse(storedItems) as LessonServiceItem[];
      return this.normalizeItems(parsedItems);
    } catch {
      return this.normalizeItems(DEFAULT_LESSON_SERVICES);
    }
  }

  private normalizeItems(items: LessonServiceItem[]): LessonServiceItem[] {
    return items
      .filter((item) => item.id && item.label && item.title)
      .slice(0, MAX_LESSON_SERVICE_ITEMS)
      .sort((first, second) => (first.displayOrder ?? 0) - (second.displayOrder ?? 0))
      .map((item, index) => ({
        ...item,
        summary: item.summary.slice(0, LESSON_SERVICE_SUMMARY_MAX_LENGTH),
        displayOrder: index + 1,
      }));
  }

  private validateDraft(draft: LessonServiceDraft): void {
    if (!draft.label.trim() || !draft.title.trim() || !draft.summary.trim() || !draft.content.trim()) {
      throw new Error('Required lesson/service fields are missing.');
    }

    if (draft.summary.trim().length > LESSON_SERVICE_SUMMARY_MAX_LENGTH) {
      throw new Error('Summary is too long.');
    }
  }

  private sanitizeDraft(draft: LessonServiceDraft): LessonServiceDraft {
    return {
      label: draft.label.trim(),
      title: draft.title.trim(),
      summary: draft.summary.trim(),
      content: draft.content.trim(),
      displayOrder: draft.displayOrder,
    };
  }

  private createId(title: string): string {
    const baseId =
      title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '') || 'lesson-service';
    const existingIds = new Set(this.items().map((item) => item.id));

    if (!existingIds.has(baseId)) {
      return baseId;
    }

    let counter = 2;
    while (existingIds.has(`${baseId}-${counter}`)) {
      counter += 1;
    }

    return `${baseId}-${counter}`;
  }
}
