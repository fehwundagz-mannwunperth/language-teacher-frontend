import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
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

import { Testimonial, TestimonialDraft } from '../../models/testimonial.model';
import {
  TESTIMONIAL_QUOTE_MAX_LENGTH,
  TestimonialService,
} from '../../core/services/testimonial.service';
import { TranslationKey } from '../../core/i18n/language.model';
import { TranslationService } from '../../core/i18n/translation.service';
import { StudioNavigationComponent } from '../studio-navigation/studio-navigation.component';

@Component({
  selector: 'app-testimonials-admin',
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
    StudioNavigationComponent,
  ],
  templateUrl: './testimonials-admin.component.html',
  styleUrl: './testimonials-admin.component.scss',
})
export class TestimonialsAdminComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly snackBar = inject(MatSnackBar);
  private readonly testimonialService = inject(TestimonialService);
  private readonly translationService = inject(TranslationService);

  protected readonly quoteMaxLength = TESTIMONIAL_QUOTE_MAX_LENGTH;
  protected readonly testimonials = this.testimonialService.publicTestimonials;
  protected readonly editingId = signal<string | null>(null);
  protected readonly isEditing = computed(() => Boolean(this.editingId()));
  protected readonly form = this.formBuilder.nonNullable.group({
    studentName: ['', Validators.required],
    studentRoleOrContext: [''],
    quote: ['', [Validators.required, Validators.maxLength(TESTIMONIAL_QUOTE_MAX_LENGTH)]],
  });

  protected save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.showError('testimonialsAdmin.validationError');
      return;
    }

    try {
      const editingId = this.editingId();
      const draft = this.buildDraft();

      if (editingId) {
        this.testimonialService.updateTestimonial(editingId, draft);
        this.showSuccess('testimonialsAdmin.updateSuccess');
      } else {
        this.testimonialService.createTestimonial(draft);
        this.showSuccess('testimonialsAdmin.createSuccess');
      }

      this.resetForm();
    } catch {
      this.showError('testimonialsAdmin.saveError');
    }
  }

  protected editItem(testimonial: Testimonial): void {
    this.editingId.set(testimonial.id);
    this.form.reset({
      studentName: testimonial.studentName,
      studentRoleOrContext: testimonial.studentRoleOrContext ?? '',
      quote: testimonial.quote,
    });
  }

  protected deleteItem(testimonial: Testimonial): void {
    const shouldDelete = window.confirm(this.t('testimonialsAdmin.deleteConfirm'));

    if (!shouldDelete) {
      return;
    }

    try {
      this.testimonialService.deleteTestimonial(testimonial.id);

      if (this.editingId() === testimonial.id) {
        this.resetForm();
      }

      this.showSuccess('testimonialsAdmin.deleteSuccess');
    } catch {
      this.showError('testimonialsAdmin.saveError');
    }
  }

  protected dropItem(event: CdkDragDrop<Testimonial[]>): void {
    const nextItems = [...this.testimonials()];
    moveItemInArray(nextItems, event.previousIndex, event.currentIndex);

    try {
      this.testimonialService.reorderTestimonials(nextItems.map((item) => item.id));
      this.showSuccess('testimonialsAdmin.orderSuccess');
    } catch {
      this.showError('testimonialsAdmin.saveError');
    }
  }

  protected resetForm(): void {
    this.editingId.set(null);
    this.form.reset({
      studentName: '',
      studentRoleOrContext: '',
      quote: '',
    });
  }

  protected t(key: TranslationKey): string {
    return this.translationService.translate(key);
  }

  private buildDraft(): TestimonialDraft {
    const value = this.form.getRawValue();

    return {
      studentName: value.studentName,
      studentRoleOrContext: value.studentRoleOrContext,
      quote: value.quote,
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
