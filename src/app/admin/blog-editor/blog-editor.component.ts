import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { BLOG_SUMMARY_MAX_LENGTH, BlogService } from '../../core/services/blog.service';
import { BlogContentBlock, BlogContentBlockType, BlogPost, BlogPostDraft } from '../../models/blog-post.model';
import { TranslationKey } from '../../core/i18n/language.model';
import { TranslationService } from '../../core/i18n/translation.service';
import { StudioNavigationComponent } from '../studio-navigation/studio-navigation.component';

@Component({
  selector: 'app-blog-editor',
  imports: [
    DatePipe,
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    ReactiveFormsModule,
    StudioNavigationComponent,
  ],
  templateUrl: './blog-editor.component.html',
  styleUrl: './blog-editor.component.scss',
})
export class BlogEditorComponent {
  private readonly blogService = inject(BlogService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly snackBar = inject(MatSnackBar);
  private readonly translationService = inject(TranslationService);

  protected readonly summaryMaxLength = BLOG_SUMMARY_MAX_LENGTH;
  protected readonly posts = this.blogService.blogPosts;
  protected readonly editingId = signal<string | null>(null);
  protected readonly isEditing = computed(() => Boolean(this.editingId()));
  protected readonly contentBlocks = signal<BlogContentBlock[]>([this.createBlock('paragraph')]);
  protected readonly form = this.formBuilder.nonNullable.group({
    title: ['', Validators.required],
    summary: ['', [Validators.required, Validators.maxLength(BLOG_SUMMARY_MAX_LENGTH)]],
  });

  protected save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.showError('blogAdmin.validationError');
      return;
    }

    try {
      const draft = this.buildDraft();
      const editingId = this.editingId();

      if (editingId) {
        this.blogService.updatePost(editingId, draft);
        this.showSuccess('blogAdmin.updateSuccess');
      } else {
        this.blogService.createPost(draft);
        this.showSuccess('blogAdmin.createSuccess');
      }

      this.resetForm();
    } catch {
      this.showError('blogAdmin.saveError');
    }
  }

  protected editPost(post: BlogPost): void {
    this.editingId.set(post.id);
    this.form.reset({
      title: post.title,
      summary: post.summary,
    });
    this.contentBlocks.set(post.contentBlocks.map((block) => ({ ...block })));
  }

  protected deletePost(post: BlogPost): void {
    const shouldDelete = window.confirm(this.t('blogAdmin.deleteConfirm'));

    if (!shouldDelete) {
      return;
    }

    try {
      this.blogService.deletePost(post.id);

      if (this.editingId() === post.id) {
        this.resetForm();
      }

      this.showSuccess('blogAdmin.deleteSuccess');
    } catch {
      this.showError('blogAdmin.saveError');
    }
  }

  protected resetForm(): void {
    this.editingId.set(null);
    this.form.reset({
      title: '',
      summary: '',
    });
    this.contentBlocks.set([this.createBlock('paragraph')]);
  }

  protected addBlock(type: BlogContentBlockType): void {
    this.contentBlocks.update((blocks) => [...blocks, this.createBlock(type)]);
  }

  protected removeBlock(blockId: string): void {
    this.contentBlocks.update((blocks) => {
      const nextBlocks = blocks.filter((block) => block.id !== blockId);
      return nextBlocks.length ? nextBlocks : [this.createBlock('paragraph')];
    });
  }

  protected updateImagePreview(event: Event, blockId: string): void {
    // Future Spring Boot endpoint: POST /api/admin/blog/{id}/images
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const imageUrl = String(reader.result ?? '');
      this.contentBlocks.update((blocks) =>
        blocks.map((block) =>
          block.id === blockId
            ? {
                ...block,
                imageUrl,
                imageName: file.name,
              }
            : block,
        ),
      );
    };
    reader.readAsDataURL(file);
  }

  protected t(key: TranslationKey): string {
    return this.translationService.translate(key);
  }

  private buildDraft(): BlogPostDraft {
    const value = this.form.getRawValue();
    const contentBlocks = this.contentBlocks().map((block) => ({ ...block }));

    return {
      title: value.title,
      summary: value.summary,
      contentBlocks,
      images: contentBlocks
        .filter((block) => block.type === 'image' && block.imageUrl)
        .map((block) => block.imageUrl as string),
    };
  }

  private createBlock(type: BlogContentBlockType): BlogContentBlock {
    return {
      id: this.blogService.createBlockId(),
      type,
      text: '',
      bold: false,
      italic: false,
      underline: false,
    };
  }

  private showSuccess(key: TranslationKey): void {
    this.snackBar.open(this.t(key), this.t('calendar.snackbar.close'), {
      duration: 3000,
      panelClass: 'success-snackbar',
    });
  }

  private showError(key: TranslationKey): void {
    this.snackBar.open(this.t(key), this.t('calendar.snackbar.close'), {
      duration: 3500,
      panelClass: 'error-snackbar',
    });
  }
}
