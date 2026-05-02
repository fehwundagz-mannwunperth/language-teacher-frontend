import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

import { TeacherProfileService } from '../../core/services/teacher-profile.service';

@Component({
  selector: 'app-about',
  imports: [AsyncPipe, MatCardModule],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss',
})
export class AboutComponent {
  private readonly teacherProfileService = inject(TeacherProfileService);

  protected readonly profile$ = this.teacherProfileService.getProfile();
}
