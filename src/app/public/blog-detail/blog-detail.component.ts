import { DatePipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

import { BlogService } from '../../core/services/blog.service';
import { TranslationKey } from '../../core/i18n/language.model';
import { TranslationService } from '../../core/i18n/translation.service';

@Component({
  selector: 'app-blog-detail',
  imports: [DatePipe, MatButtonModule, RouterLink],
  templateUrl: './blog-detail.component.html',
  styleUrl: './blog-detail.component.scss',
})
export class BlogDetailComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly blogService = inject(BlogService);
  private readonly translationService = inject(TranslationService);

  protected readonly post = computed(() => {
    const id = this.route.snapshot.paramMap.get('id');
    return id ? this.blogService.getPostById(id) : undefined;
  });

  protected t(key: TranslationKey): string {
    return this.translationService.translate(key);
  }
}
