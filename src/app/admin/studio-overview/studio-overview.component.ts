import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

import { TranslationKey } from '../../core/i18n/language.model';
import { TranslationService } from '../../core/i18n/translation.service';
import { StudioNavigationComponent } from '../studio-navigation/studio-navigation.component';

@Component({
  selector: 'app-studio-overview',
  imports: [MatButtonModule, MatCardModule, RouterLink, StudioNavigationComponent],
  templateUrl: './studio-overview.component.html',
  styleUrl: './studio-overview.component.scss',
})
export class StudioOverviewComponent {
  private readonly translationService = inject(TranslationService);

  protected t(key: TranslationKey): string {
    return this.translationService.translate(key);
  }
}
