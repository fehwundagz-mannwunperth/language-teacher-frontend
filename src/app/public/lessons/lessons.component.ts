import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';

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

  protected readonly lessons$ = this.lessonService.getLessons();
}
