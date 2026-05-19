import { Injectable, signal } from '@angular/core';

import { Testimonial, TestimonialDraft } from '../../models/testimonial.model';

const STORAGE_KEY = 'language-teacher-testimonials';
export const TESTIMONIAL_QUOTE_MAX_LENGTH = 300;

const DEFAULT_TESTIMONIALS: Testimonial[] = [
  {
    id: 'kata-business-english',
    studentName: 'Kata',
    studentRoleOrContext: 'Business English student',
    quote:
      'The lessons are calm, structured, and practical. I finally feel comfortable speaking at work.',
    displayOrder: 1,
  },
  {
    id: 'mate-exam-preparation',
    studentName: 'Mate',
    studentRoleOrContext: 'Exam preparation student',
    quote:
      'Brigitta explained grammar clearly and gave me speaking tasks that matched my exam goals.',
    displayOrder: 2,
  },
  {
    id: 'eszter-conversation',
    studentName: 'Eszter',
    studentRoleOrContext: 'Conversation student',
    quote: 'Every lesson has a clear focus, useful feedback, and materials I can actually use.',
    displayOrder: 3,
  },
];

@Injectable({ providedIn: 'root' })
export class TestimonialService {
  private readonly items = signal<Testimonial[]>(this.readStoredItems());

  readonly publicTestimonials = this.items.asReadonly();

  public getPublicTestimonials(): Testimonial[] {
    // Future Spring Boot endpoint: GET /api/public/testimonials
    return this.items();
  }

  public getAdminTestimonials(): Testimonial[] {
    // Future Spring Boot endpoint: GET /api/admin/testimonials
    return this.items();
  }

  public createTestimonial(draft: TestimonialDraft): Testimonial {
    // Future Spring Boot endpoint: POST /api/admin/testimonials
    this.validateDraft(draft);

    const currentItems = this.items();
    const nextItem: Testimonial = {
      ...this.sanitizeDraft(draft),
      id: this.createId(draft.studentName),
      displayOrder: currentItems.length + 1,
    };

    this.persist([...currentItems, nextItem]);
    return nextItem;
  }

  public updateTestimonial(id: string, draft: TestimonialDraft): Testimonial {
    // Future Spring Boot endpoint: PUT /api/admin/testimonials/{id}
    this.validateDraft(draft);

    const currentItems = this.items();
    const existingItem = currentItems.find((item) => item.id === id);

    if (!existingItem) {
      throw new Error('Testimonial was not found.');
    }

    const nextItem: Testimonial = {
      ...existingItem,
      ...this.sanitizeDraft(draft),
      displayOrder: existingItem.displayOrder,
    };

    this.persist(currentItems.map((item) => (item.id === id ? nextItem : item)));
    return nextItem;
  }

  public deleteTestimonial(id: string): void {
    // Future Spring Boot endpoint: DELETE /api/admin/testimonials/{id}
    const nextItems = this.items().filter((item) => item.id !== id);

    if (nextItems.length === this.items().length) {
      throw new Error('Testimonial was not found.');
    }

    this.persist(nextItems);
  }

  public reorderTestimonials(ids: string[]): void {
    // Future Spring Boot endpoint: PUT /api/admin/testimonials/order
    const currentItems = this.items();
    const orderedItems = ids
      .map((id) => currentItems.find((item) => item.id === id))
      .filter((item): item is Testimonial => Boolean(item));
    const missingItems = currentItems.filter((item) => !ids.includes(item.id));

    this.persist([...orderedItems, ...missingItems]);
  }

  private persist(items: Testimonial[]): void {
    const normalizedItems = this.normalizeItems(items);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(normalizedItems));
    this.items.set(normalizedItems);
  }

  private readStoredItems(): Testimonial[] {
    const storedItems = localStorage.getItem(STORAGE_KEY);

    if (!storedItems) {
      return this.normalizeItems(DEFAULT_TESTIMONIALS, true);
    }

    try {
      const parsedItems = JSON.parse(storedItems) as Partial<Testimonial>[];
      return this.normalizeItems(parsedItems, true);
    } catch {
      return this.normalizeItems(DEFAULT_TESTIMONIALS, true);
    }
  }

  private normalizeItems(items: Partial<Testimonial>[], sortByDisplayOrder = false): Testimonial[] {
    const validItems = items
      .map((item, index) => this.normalizeItem(item, index))
      .filter((item): item is Testimonial => Boolean(item));
    const orderedItems = sortByDisplayOrder
      ? [...validItems].sort(
          (first, second) =>
            (first.displayOrder ?? Number.MAX_SAFE_INTEGER) -
            (second.displayOrder ?? Number.MAX_SAFE_INTEGER),
        )
      : validItems;

    return orderedItems.map((item, index) => ({
      ...item,
      displayOrder: index + 1,
    }));
  }

  private normalizeItem(item: Partial<Testimonial>, index: number): Testimonial | null {
    const studentName = item.studentName?.trim();
    const quote = item.quote?.trim().slice(0, TESTIMONIAL_QUOTE_MAX_LENGTH);

    if (!studentName || !quote) {
      return null;
    }

    return {
      id: String(item.id ?? this.createId(`${studentName}-${index + 1}`)),
      studentName,
      studentRoleOrContext: item.studentRoleOrContext?.trim() || undefined,
      quote,
      displayOrder: item.displayOrder ?? index + 1,
    };
  }

  private validateDraft(draft: TestimonialDraft): void {
    if (!draft.studentName.trim() || !draft.quote.trim()) {
      throw new Error('Required testimonial fields are missing.');
    }

    if (draft.quote.trim().length > TESTIMONIAL_QUOTE_MAX_LENGTH) {
      throw new Error('Quote is too long.');
    }
  }

  private sanitizeDraft(draft: TestimonialDraft): TestimonialDraft {
    return {
      studentName: draft.studentName.trim(),
      studentRoleOrContext: draft.studentRoleOrContext?.trim() || undefined,
      quote: draft.quote.trim(),
    };
  }

  private createId(seed: string): string {
    const baseId =
      seed
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '') || 'testimonial';
    const existingIds = new Set(this.items?.().map((item) => item.id) ?? []);

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
