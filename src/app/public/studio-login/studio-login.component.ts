import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

import { AdminAuthService } from '../../core/auth/admin-auth.service';
import { TranslationKey } from '../../core/i18n/language.model';
import { TranslationService } from '../../core/i18n/translation.service';

@Component({
  selector: 'app-studio-login',
  imports: [
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    ReactiveFormsModule,
  ],
  templateUrl: './studio-login.component.html',
  styleUrl: './studio-login.component.scss',
})
export class StudioLoginComponent implements OnInit {
  private readonly adminAuthService = inject(AdminAuthService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);
  private readonly translationService = inject(TranslationService);

  protected forgotPasswordMode = false;
  protected readonly loginForm = this.formBuilder.nonNullable.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });
  protected readonly forgotPasswordForm = this.formBuilder.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
  });

  ngOnInit(): void {
    if (this.adminAuthService.refreshSession()) {
      void this.router.navigate(['/studio/overview']);
    }
  }

  protected login(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const { username, password } = this.loginForm.getRawValue();
    const loginSucceeded = this.adminAuthService.login(username, password);

    if (!loginSucceeded) {
      this.showError('studioLogin.invalidCredentials');
      return;
    }

    this.showSuccess('studioLogin.loginSuccess');
    void this.router.navigate(['/studio/overview']);
  }

  protected sendForgotPassword(): void {
    if (this.forgotPasswordForm.invalid) {
      this.forgotPasswordForm.markAllAsTouched();
      return;
    }

    this.adminAuthService.forgotPassword(this.forgotPasswordForm.controls.email.value);
    this.showSuccess('studioLogin.forgotPasswordSuccess');
    this.forgotPasswordForm.reset();
    this.forgotPasswordMode = false;
  }

  protected showForgotPassword(): void {
    this.forgotPasswordMode = true;
  }

  protected showLogin(): void {
    this.forgotPasswordMode = false;
  }

  protected t(key: TranslationKey): string {
    return this.translationService.translate(key);
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
