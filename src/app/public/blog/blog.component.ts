import { DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';

import { BlogService } from '../../core/services/blog.service';
import { TranslationKey } from '../../core/i18n/language.model';
import { TranslationService } from '../../core/i18n/translation.service';

@Component({
  selector: 'app-blog',
  imports: [DatePipe, MatCardModule, RouterLink],
  templateUrl: './blog.component.html',
  styleUrl: './blog.component.scss',
})
export class BlogComponent {
  private readonly blogService = inject(BlogService);
  private readonly translationService = inject(TranslationService);

  protected readonly posts = this.blogService.blogPosts;

  protected t(key: TranslationKey): string {
    return this.translationService.translate(key);
  }
}
