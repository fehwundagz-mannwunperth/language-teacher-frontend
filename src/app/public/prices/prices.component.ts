import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';

import { TranslationKey } from '../../core/i18n/language.model';
import { TranslationService } from '../../core/i18n/translation.service';
import { PricingService } from '../../core/services/pricing.service';

@Component({
  selector: 'app-prices',
  imports: [AsyncPipe, CurrencyPipe, MatCardModule, MatListModule],
  templateUrl: './prices.component.html',
  styleUrl: './prices.component.scss',
})
export class PricesComponent {
  private readonly pricingService = inject(PricingService);
  private readonly translationService = inject(TranslationService);

  protected readonly packages$ = this.pricingService.getPricePackages();

  protected t(key: TranslationKey): string {
    return this.translationService.translate(key);
  }
}
