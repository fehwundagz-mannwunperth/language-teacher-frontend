import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

import { TranslationKey } from '../../core/i18n/language.model';
import { TranslationService } from '../../core/i18n/translation.service';
import { LegalTermsService } from '../../core/services/legal-terms.service';
import { LegalTermsSectionKey } from '../../models/legal-terms.model';

@Component({
  selector: 'app-terms-and-conditions',
  imports: [AsyncPipe, MatCardModule],
  templateUrl: './terms-and-conditions.component.html',
  styleUrl: './terms-and-conditions.component.scss',
})
export class TermsAndConditionsComponent {
  private readonly legalTermsService = inject(LegalTermsService);
  private readonly translationService = inject(TranslationService);

  protected readonly terms$ = this.legalTermsService.getTerms();
  protected readonly sectionTitleKeys: Record<LegalTermsSectionKey, TranslationKey> = {
    contractFormation: 'legal.terms.sections.contractFormation',
    serviceDescription: 'legal.terms.sections.serviceDescription',
    paymentTerms: 'legal.terms.sections.paymentTerms',
    cancellationPolicy: 'legal.terms.sections.cancellationPolicy',
    complaintHandling: 'legal.terms.sections.complaintHandling',
    copyrightNotice: 'legal.terms.sections.copyrightNotice',
    cookieInformation: 'legal.terms.sections.cookieInformation',
  };

  protected t(key: TranslationKey): string {
    return this.translationService.translate(key);
  }
}
