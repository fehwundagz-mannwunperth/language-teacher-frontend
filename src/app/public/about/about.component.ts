import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

import { TranslationKey } from '../../core/i18n/language.model';
import { TranslationService } from '../../core/i18n/translation.service';
import { TeacherProfileService } from '../../core/services/teacher-profile.service';

@Component({
  selector: 'app-about',
  imports: [AsyncPipe, MatCardModule],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss',
})
export class AboutComponent {
  private readonly teacherProfileService = inject(TeacherProfileService);
  private readonly translationService = inject(TranslationService);

  protected readonly profile$ = this.teacherProfileService.getProfile();

  protected t(key: TranslationKey): string {
    return this.translationService.translate(key);
  }
}
