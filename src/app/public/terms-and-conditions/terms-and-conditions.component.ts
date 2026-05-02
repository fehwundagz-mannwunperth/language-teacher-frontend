import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

import { TranslationKey } from '../../core/i18n/language.model';
import { TranslationService } from '../../core/i18n/translation.service';

@Component({
  selector: 'app-terms-and-conditions',
  imports: [MatCardModule],
  templateUrl: './terms-and-conditions.component.html',
  styleUrl: './terms-and-conditions.component.scss',
})
export class TermsAndConditionsComponent {
  private readonly translationService = inject(TranslationService);

  protected t(key: TranslationKey): string {
    return this.translationService.translate(key);
  }
}
