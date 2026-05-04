import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

import { AdminAuthService } from '../../core/auth/admin-auth.service';
import { TranslationKey } from '../../core/i18n/language.model';
import { TranslationService } from '../../core/i18n/translation.service';

@Component({
  selector: 'app-studio-overview',
  imports: [MatButtonModule, MatCardModule, RouterLink],
  templateUrl: './studio-overview.component.html',
  styleUrl: './studio-overview.component.scss',
})
export class StudioOverviewComponent {
  private readonly adminAuthService = inject(AdminAuthService);
  private readonly router = inject(Router);
  private readonly translationService = inject(TranslationService);

  protected logout(): void {
    this.adminAuthService.logout();
    void this.router.navigate(['/']);
  }

  protected t(key: TranslationKey): string {
    return this.translationService.translate(key);
  }
}
