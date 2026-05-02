import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, Validators, FormBuilder } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { TranslationKey } from '../../../core/i18n/language.model';
import { TranslationService } from '../../../core/i18n/translation.service';

export interface BookingDialogData {
  slotTime: string;
}

export interface BookingDialogResult {
  customerName: string;
  customerEmail: string;
}

@Component({
  selector: 'app-booking-dialog',
  imports: [
    MatButtonModule,
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogTitle,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
  templateUrl: './booking-dialog.component.html',
  styleUrl: './booking-dialog.component.scss',
})
export class BookingDialogComponent {
  private readonly dialogRef = inject(MatDialogRef<BookingDialogComponent, BookingDialogResult>);
  private readonly formBuilder = inject(FormBuilder);
  private readonly translationService = inject(TranslationService);

  protected readonly data = inject<BookingDialogData>(MAT_DIALOG_DATA);
  protected readonly bookingForm = this.formBuilder.nonNullable.group({
    customerName: ['', Validators.required],
    customerEmail: ['', [Validators.required, Validators.email]],
  });

  protected submit(): void {
    if (this.bookingForm.invalid) {
      this.bookingForm.markAllAsTouched();
      return;
    }

    this.dialogRef.close(this.bookingForm.getRawValue());
  }

  protected t(key: TranslationKey): string {
    return this.translationService.translate(key);
  }
}
