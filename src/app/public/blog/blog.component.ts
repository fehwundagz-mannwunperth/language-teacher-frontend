import { AsyncPipe, DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';

import { BlogService } from '../../core/services/blog.service';
import { TranslationKey } from '../../core/i18n/language.model';
import { TranslationService } from '../../core/i18n/translation.service';

@Component({
  selector: 'app-blog',
  imports: [AsyncPipe, DatePipe, MatCardModule, MatChipsModule],
  templateUrl: './blog.component.html',
  styleUrl: './blog.component.scss',
})
export class BlogComponent {
  private readonly blogService = inject(BlogService);
  private readonly translationService = inject(TranslationService);

  protected readonly posts$ = this.blogService.getPosts();

  protected t(key: TranslationKey): string {
    return this.translationService.translate(key);
  }
}
