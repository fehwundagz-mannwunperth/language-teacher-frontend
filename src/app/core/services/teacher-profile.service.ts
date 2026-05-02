import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { TeacherProfile } from '../../models/teacher-profile.model';

@Injectable({ providedIn: 'root' })
export class TeacherProfileService {
  getProfile(): Observable<TeacherProfile> {
    // Future Spring Boot endpoint: GET /api/public/profile
    return of({
      name: 'Anna Kovacs',
      headline: 'Private English lessons for confident, practical communication',
      bio: 'I help adults and teens improve speaking, grammar, exam preparation, and workplace English with calm, structured lessons.',
      languages: ['English', 'Hungarian'],
      email: 'hello@annalanguages.example',
      location: 'Budapest and online',
      yearsExperience: 9,
    });
  }
}
