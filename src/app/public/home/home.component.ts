import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

import { LessonService } from '../../core/services/lesson.service';
import { TranslationKey } from '../../core/i18n/language.model';
import { TranslationService } from '../../core/i18n/translation.service';
import { TeacherProfileService } from '../../core/services/teacher-profile.service';
import { SectionCardComponent } from '../../shared/components/section-card/section-card.component';

@Component({
  selector: 'app-home',
  imports: [AsyncPipe, MatButtonModule, MatCardModule, RouterLink, SectionCardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  private readonly teacherProfileService = inject(TeacherProfileService);
  private readonly lessonService = inject(LessonService);
  private readonly translationService = inject(TranslationService);

  protected readonly profile$ = this.teacherProfileService.getProfile();
  protected readonly lessons$ = this.lessonService.getLessons();
  protected readonly testimonials = [
    {
      quoteKey: 'home.testimonial1.quote',
      nameKey: 'home.testimonial1.name',
      contextKey: 'home.testimonial1.context',
    },
    {
      quoteKey: 'home.testimonial2.quote',
      nameKey: 'home.testimonial2.name',
      contextKey: 'home.testimonial2.context',
    },
    {
      quoteKey: 'home.testimonial3.quote',
      nameKey: 'home.testimonial3.name',
      contextKey: 'home.testimonial3.context',
    },
  ] satisfies { quoteKey: TranslationKey; nameKey: TranslationKey; contextKey: TranslationKey }[];

  protected t(key: TranslationKey): string {
    return this.translationService.translate(key);
  }
}
