import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { PrivacyPolicy } from '../../models/privacy-policy.model';

@Injectable({ providedIn: 'root' })
export class PrivacyPolicyService {
  getPrivacyPolicy(): Observable<PrivacyPolicy> {
    // Future Spring Boot endpoint: GET /api/public/legal/privacy-policy
    return of({
      sections: [
        {
          key: 'dataController',
          order: 1,
          content: 'Placeholder content for data controller information will be added here later.',
        },
        {
          key: 'processedData',
          order: 2,
          content: 'Placeholder content for processed data will be added here later.',
        },
        {
          key: 'purposeOfProcessing',
          order: 3,
          content: 'Placeholder content for purpose of processing will be added here later.',
        },
        {
          key: 'legalBasis',
          order: 4,
          content: 'Placeholder content for legal basis will be added here later.',
        },
        {
          key: 'dataRetention',
          order: 5,
          content: 'Placeholder content for data retention will be added here later.',
        },
        {
          key: 'dataSubjectRights',
          order: 6,
          content: 'Placeholder content for data subject rights will be added here later.',
        },
        {
          key: 'contactForPrivacyRequests',
          order: 7,
          content:
            'Placeholder content for contact details for privacy requests will be added here later.',
        },
      ],
    });
  }
}
