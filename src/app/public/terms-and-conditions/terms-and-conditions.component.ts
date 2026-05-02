import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

import { TranslationKey } from '../../core/i18n/language.model';
import { TranslationService } from '../../core/i18n/translation.service';
import { FooterInfoService } from '../../core/services/footer-info.service';
import { LegalTermsService } from '../../core/services/legal-terms.service';
import { FooterProviderInfo } from '../../models/footer-provider-info.model';
import { LegalTermsSectionKey } from '../../models/legal-terms.model';

@Component({
  selector: 'app-terms-and-conditions',
  imports: [AsyncPipe, MatCardModule],
  templateUrl: './terms-and-conditions.component.html',
  styleUrl: './terms-and-conditions.component.scss',
})
export class TermsAndConditionsComponent {
  private readonly footerInfoService = inject(FooterInfoService);
  private readonly legalTermsService = inject(LegalTermsService);
  private readonly translationService = inject(TranslationService);

  protected readonly providerInfo$ = this.footerInfoService.getProviderInfo();
  protected readonly terms$ = this.legalTermsService.getTerms();
  protected readonly providerFields: { key: keyof FooterProviderInfo; labelKey: TranslationKey }[] =
    [
      { key: 'companyName', labelKey: 'legal.terms.provider.companyName' },
      { key: 'registeredOffice', labelKey: 'legal.terms.provider.registeredOffice' },
      { key: 'taxNumber', labelKey: 'legal.terms.provider.taxNumber' },
      { key: 'serviceProviderPerson', labelKey: 'legal.terms.provider.serviceProviderPerson' },
      { key: 'registrationNumber', labelKey: 'legal.terms.provider.registrationNumber' },
    ];
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
