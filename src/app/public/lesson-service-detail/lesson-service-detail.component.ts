import { Component, computed, inject } from '@angular/core';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

import { TranslationKey } from '../../core/i18n/language.model';
import { TranslationService } from '../../core/i18n/translation.service';
import { LessonServiceService } from '../../core/services/lesson-service.service';

@Component({
  selector: 'app-lesson-service-detail',
  imports: [MatButtonModule, MatCardModule, RouterLink],
  templateUrl: './lesson-service-detail.component.html',
  styleUrl: './lesson-service-detail.component.scss',
})
export class LessonServiceDetailComponent {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly lessonServiceService = inject(LessonServiceService);
  private readonly translationService = inject(TranslationService);

  protected readonly lessonService = computed(() => {
    const id = this.activatedRoute.snapshot.paramMap.get('id') ?? '';
    return this.lessonServiceService.getPublicLessonServiceById(id);
  });

  protected t(key: TranslationKey): string {
    return this.translationService.translate(key);
  }
}
