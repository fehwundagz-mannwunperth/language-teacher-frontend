import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { TranslationKey } from '../../core/i18n/language.model';
import { TranslationService } from '../../core/i18n/translation.service';
import { LessonServiceService } from '../../core/services/lesson-service.service';
import { SectionCardComponent } from '../../shared/components/section-card/section-card.component';

@Component({
  selector: 'app-lessons',
  imports: [RouterLink, SectionCardComponent],
  templateUrl: './lessons.component.html',
  styleUrl: './lessons.component.scss',
})
export class LessonsComponent {
  private readonly lessonServiceService = inject(LessonServiceService);
  private readonly translationService = inject(TranslationService);

  protected readonly lessonServices = this.lessonServiceService.lessonServices;

  protected t(key: TranslationKey): string {
    return this.translationService.translate(key);
  }
}
