import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

import { TranslationKey } from '../../core/i18n/language.model';
import { TranslationService } from '../../core/i18n/translation.service';
import { PrivacyPolicyService } from '../../core/services/privacy-policy.service';
import { PrivacyPolicySectionKey } from '../../models/privacy-policy.model';

@Component({
  selector: 'app-privacy-policy',
  imports: [AsyncPipe, MatCardModule],
  templateUrl: './privacy-policy.component.html',
  styleUrl: './privacy-policy.component.scss',
})
export class PrivacyPolicyComponent {
  private readonly privacyPolicyService = inject(PrivacyPolicyService);
  private readonly translationService = inject(TranslationService);

  protected readonly privacyPolicy$ = this.privacyPolicyService.getPrivacyPolicy();
  protected readonly sectionTitleKeys: Record<PrivacyPolicySectionKey, TranslationKey> = {
    dataController: 'legal.privacy.sections.dataController',
    processedData: 'legal.privacy.sections.processedData',
    purposeOfProcessing: 'legal.privacy.sections.purposeOfProcessing',
    legalBasis: 'legal.privacy.sections.legalBasis',
    dataRetention: 'legal.privacy.sections.dataRetention',
    dataSubjectRights: 'legal.privacy.sections.dataSubjectRights',
    contactForPrivacyRequests: 'legal.privacy.sections.contactForPrivacyRequests',
  };

  protected t(key: TranslationKey): string {
    return this.translationService.translate(key);
  }
}
