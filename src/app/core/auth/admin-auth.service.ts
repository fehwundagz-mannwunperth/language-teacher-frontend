import { Injectable, signal } from '@angular/core';

const STORAGE_KEY = 'language-teacher-admin-authenticated';
const ADMIN_EMAIL_STORAGE_KEY = 'language-teacher-admin-email';
const ADMIN_PASSWORD_STORAGE_KEY = 'language-teacher-admin-password';
const MOCK_USERNAME = 'admin';
const DEFAULT_MOCK_ADMIN_EMAIL = 'admin@example.com';
const DEFAULT_MOCK_PASSWORD = 'admin123';

@Injectable({ providedIn: 'root' })
export class AdminAuthService {
  private readonly loggedIn = signal(this.readStoredLoginState());
  private readonly adminEmail = signal(this.readStoredAdminEmail());

  readonly isLoggedIn = this.loggedIn.asReadonly();
  readonly currentAdminEmail = this.adminEmail.asReadonly();

  public login(username: string, password: string): boolean {
    // Future Spring Boot endpoint: POST /api/admin/auth/login
    const isValid = username === MOCK_USERNAME && password === this.readStoredAdminPassword();

    if (isValid) {
      localStorage.setItem(STORAGE_KEY, 'true');
      this.loggedIn.set(true);
    }

    return isValid;
  }

  public logout(): void {
    // Future Spring Boot endpoint: POST /api/admin/auth/logout
    localStorage.removeItem(STORAGE_KEY);
    this.loggedIn.set(false);
  }

  public forgotPassword(email: string): void {
    // Future Spring Boot endpoint: POST /api/admin/auth/forgot-password
    void email;
  }

  public getAdminAccountEmail(): string {
    // Future Spring Boot endpoint: GET /api/admin/account
    const email = this.readStoredAdminEmail();
    this.adminEmail.set(email);
    return email;
  }

  public updateAdminEmail(email: string): void {
    // Future Spring Boot endpoint: PUT /api/admin/account/email
    localStorage.setItem(ADMIN_EMAIL_STORAGE_KEY, email);
    this.adminEmail.set(email);
  }

  public changeAdminPassword(currentPassword: string, newPassword: string): boolean {
    // Future Spring Boot endpoint: PUT /api/admin/account/password
    if (currentPassword !== this.readStoredAdminPassword()) {
      return false;
    }

    localStorage.setItem(ADMIN_PASSWORD_STORAGE_KEY, newPassword);
    return true;
  }

  public refreshSession(): boolean {
    // Future Spring Boot endpoint: GET /api/admin/auth/me
    const isLoggedIn = this.readStoredLoginState();
    this.loggedIn.set(isLoggedIn);
    return isLoggedIn;
  }

  private readStoredLoginState(): boolean {
    return localStorage.getItem(STORAGE_KEY) === 'true';
  }

  private readStoredAdminEmail(): string {
    return localStorage.getItem(ADMIN_EMAIL_STORAGE_KEY) || DEFAULT_MOCK_ADMIN_EMAIL;
  }

  private readStoredAdminPassword(): string {
    return localStorage.getItem(ADMIN_PASSWORD_STORAGE_KEY) || DEFAULT_MOCK_PASSWORD;
  }
}
