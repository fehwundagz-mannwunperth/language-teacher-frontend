import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { LessonType } from '../../models/lesson-type.model';

@Injectable({ providedIn: 'root' })
export class LessonService {
  getLessons(): Observable<LessonType[]> {
    // Future Spring Boot endpoint: GET /api/public/lessons
    return of([
      {
        id: 1,
        title: 'Conversation English',
        description: 'Guided speaking practice with vocabulary, pronunciation, and natural phrases.',
        level: 'A2-C1',
        durationMinutes: 60,
      },
      {
        id: 2,
        title: 'Exam Preparation',
        description: 'Focused preparation for school exams, language certificates, and interviews.',
        level: 'B1-C1',
        durationMinutes: 90,
      },
      {
        id: 3,
        title: 'Business English',
        description: 'Meetings, presentations, emails, and confidence for international work.',
        level: 'B1-C1',
        durationMinutes: 60,
      },
    ]);
  }
}
