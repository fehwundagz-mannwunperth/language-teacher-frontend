import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

import { LessonService } from '../../core/services/lesson.service';
import { TeacherProfileService } from '../../core/services/teacher-profile.service';
import { SectionCardComponent } from '../../shared/components/section-card/section-card.component';

@Component({
  selector: 'app-home',
  imports: [AsyncPipe, MatButtonModule, RouterLink, SectionCardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  private readonly teacherProfileService = inject(TeacherProfileService);
  private readonly lessonService = inject(LessonService);

  protected readonly profile$ = this.teacherProfileService.getProfile();
  protected readonly lessons$ = this.lessonService.getLessons();
}
