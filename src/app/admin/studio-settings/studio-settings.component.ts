import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { AdminAuthService } from '../../core/auth/admin-auth.service';
import { TranslationKey } from '../../core/i18n/language.model';
import { TranslationService } from '../../core/i18n/translation.service';
import { StudioNavigationComponent } from '../studio-navigation/studio-navigation.component';

@Component({
  selector: 'app-studio-settings',
  imports: [
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    ReactiveFormsModule,
    StudioNavigationComponent,
  ],
  templateUrl: './studio-settings.component.html',
  styleUrl: './studio-settings.component.scss',
})
export class StudioSettingsComponent {
  private readonly adminAuthService = inject(AdminAuthService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly snackBar = inject(MatSnackBar);
  private readonly translationService = inject(TranslationService);

  protected readonly currentAdminEmail = this.adminAuthService.currentAdminEmail;
  protected readonly emailForm = this.formBuilder.nonNullable.group({
    email: [
      this.adminAuthService.getAdminAccountEmail(),
      [Validators.required, Validators.email],
    ],
  });
  protected readonly passwordForm = this.formBuilder.nonNullable.group(
    {
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required],
    },
    { validators: this.matchingPasswordsValidator },
  );

  protected saveEmail(): void {
    if (this.emailForm.invalid) {
      this.emailForm.markAllAsTouched();
      return;
    }

    const email = this.emailForm.controls.email.value.trim();
    this.adminAuthService.updateAdminEmail(email);
    this.emailForm.controls.email.setValue(email);
    this.showSuccess('studioSettings.emailSaveSuccess');
  }

  protected changePassword(): void {
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      return;
    }

    const { currentPassword, newPassword } = this.passwordForm.getRawValue();
    const changed = this.adminAuthService.changeAdminPassword(currentPassword, newPassword);

    if (!changed) {
      this.passwordForm.controls.currentPassword.setErrors({ wrongPassword: true });
      this.showError('studioSettings.currentPasswordWrong');
      return;
    }

    this.passwordForm.reset();
    this.showSuccess('studioSettings.passwordSaveSuccess');
  }

  protected t(key: TranslationKey): string {
    return this.translationService.translate(key);
  }

  private matchingPasswordsValidator(control: AbstractControl): ValidationErrors | null {
    const confirmControl = control.get('confirmPassword');
    const newPassword = control.get('newPassword')?.value;
    const confirmPassword = confirmControl?.value;

    if (!newPassword || !confirmPassword || newPassword === confirmPassword) {
      if (confirmControl?.hasError('passwordMismatch')) {
        const { passwordMismatch, ...errors } = confirmControl.errors ?? {};
        void passwordMismatch;
        confirmControl.setErrors(Object.keys(errors).length ? errors : null);
      }

      return null;
    }

    confirmControl?.setErrors({
      ...(confirmControl.errors ?? {}),
      passwordMismatch: true,
    });

    return { passwordMismatch: true };
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
