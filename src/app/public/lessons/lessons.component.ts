import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';

import { TranslationKey } from '../../core/i18n/language.model';
import { TranslationService } from '../../core/i18n/translation.service';
import { LessonService } from '../../core/services/lesson.service';
import { SectionCardComponent } from '../../shared/components/section-card/section-card.component';

@Component({
  selector: 'app-lessons',
  imports: [AsyncPipe, SectionCardComponent],
  templateUrl: './lessons.component.html',
  styleUrl: './lessons.component.scss',
})
export class LessonsComponent {
  private readonly lessonService = inject(LessonService);
  private readonly translationService = inject(TranslationService);

  protected readonly lessons$ = this.lessonService.getLessons();

  protected t(key: TranslationKey): string {
    return this.translationService.translate(key);
  }
}
