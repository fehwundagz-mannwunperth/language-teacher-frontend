import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import {
  CdkDrag,
  CdkDragDrop,
  CdkDragHandle,
  CdkDropList,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { LessonServiceDraft, LessonServiceItem } from '../../models/lesson-service.model';
import {
  LESSON_SERVICE_SUMMARY_MAX_LENGTH,
  LessonServiceService,
  MAX_LESSON_SERVICE_ITEMS,
} from '../../core/services/lesson-service.service';
import { TranslationKey } from '../../core/i18n/language.model';
import { TranslationService } from '../../core/i18n/translation.service';

@Component({
  selector: 'app-lesson-services-admin',
  imports: [
    CdkDrag,
    CdkDragHandle,
    CdkDropList,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    ReactiveFormsModule,
    RouterLink,
  ],
  templateUrl: './lesson-services-admin.component.html',
  styleUrl: './lesson-services-admin.component.scss',
})
export class LessonServicesAdminComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly lessonServiceService = inject(LessonServiceService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly translationService = inject(TranslationService);

  protected readonly maxItems = MAX_LESSON_SERVICE_ITEMS;
  protected readonly summaryMaxLength = LESSON_SERVICE_SUMMARY_MAX_LENGTH;
  protected readonly items = this.lessonServiceService.lessonServices;
  protected readonly editingId = signal<string | null>(null);
  protected readonly isEditing = computed(() => Boolean(this.editingId()));
  protected readonly canCreateMore = computed(() => this.items().length < MAX_LESSON_SERVICE_ITEMS);
  protected readonly form = this.formBuilder.nonNullable.group({
    label: ['', Validators.required],
    title: ['', Validators.required],
    summary: ['', [Validators.required, Validators.maxLength(LESSON_SERVICE_SUMMARY_MAX_LENGTH)]],
    content: ['', Validators.required],
  });

  protected save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.showError('lessonServicesAdmin.validationError');
      return;
    }

    const editingId = this.editingId();

    if (!editingId && !this.canCreateMore()) {
      this.showError('lessonServicesAdmin.maxItemsError');
      return;
    }

    try {
      const draft = this.buildDraft();

      if (editingId) {
        this.lessonServiceService.updateLessonService(editingId, draft);
        this.showSuccess('lessonServicesAdmin.updateSuccess');
      } else {
        this.lessonServiceService.createLessonService(draft);
        this.showSuccess('lessonServicesAdmin.createSuccess');
      }

      this.resetForm();
    } catch {
      this.showError('lessonServicesAdmin.saveError');
    }
  }

  protected editItem(item: LessonServiceItem): void {
    this.editingId.set(item.id);
    this.form.reset({
      label: item.label,
      title: item.title,
      summary: item.summary,
      content: item.content,
    });
  }

  protected deleteItem(item: LessonServiceItem): void {
    const shouldDelete = window.confirm(this.t('lessonServicesAdmin.deleteConfirm'));

    if (!shouldDelete) {
      return;
    }

    try {
      this.lessonServiceService.deleteLessonService(item.id);

      if (this.editingId() === item.id) {
        this.resetForm();
      }

      this.showSuccess('lessonServicesAdmin.deleteSuccess');
    } catch {
      this.showError('lessonServicesAdmin.saveError');
    }
  }

  protected dropItem(event: CdkDragDrop<LessonServiceItem[]>): void {
    const nextItems = [...this.items()];
    moveItemInArray(nextItems, event.previousIndex, event.currentIndex);

    try {
      this.lessonServiceService.reorderLessonServices(nextItems.map((item) => item.id));
      this.showSuccess('lessonServicesAdmin.orderSuccess');
    } catch {
      this.showError('lessonServicesAdmin.saveError');
    }
  }

  protected resetForm(): void {
    this.editingId.set(null);
    this.form.reset({
      label: '',
      title: '',
      summary: '',
      content: '',
    });
  }

  protected t(key: TranslationKey): string {
    return this.translationService.translate(key);
  }

  private buildDraft(): LessonServiceDraft {
    const value = this.form.getRawValue();

    return {
      label: value.label,
      title: value.title,
      summary: value.summary,
      content: value.content,
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
