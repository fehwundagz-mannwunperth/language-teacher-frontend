import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { BlogPost } from '../../models/blog-post.model';

@Injectable({ providedIn: 'root' })
export class BlogService {
  getPosts(): Observable<BlogPost[]> {
    // Future Spring Boot endpoint: GET /api/public/blog
    return of([
      {
        id: 1,
        title: 'How to build a daily speaking habit',
        excerpt: 'Small, repeatable exercises that make English practice easier to keep.',
        content: 'Choose one topic, speak for two minutes, and save useful phrases for review.',
        publishedAt: '2026-04-12',
        tags: ['speaking', 'habits'],
      },
      {
        id: 2,
        title: 'What to prepare before a business English lesson',
        excerpt: 'Bring real examples from meetings, emails, or presentations to make lessons useful.',
        content: 'Practical materials help us focus on language you can use immediately.',
        publishedAt: '2026-03-28',
        tags: ['business', 'work'],
      },
    ]);
  }
}
