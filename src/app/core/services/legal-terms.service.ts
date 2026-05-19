import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { LegalTerms } from '../../models/legal-terms.model';

@Injectable({ providedIn: 'root' })
export class LegalTermsService {
  public getTerms(): Observable<LegalTerms> {
    // Future Spring Boot endpoint: GET /api/public/legal/terms
    return of({
      sections: [
        {
          key: 'contractFormation',
          order: 1,
          content: 'Placeholder content for contract formation will be added here later.',
        },
        {
          key: 'serviceDescription',
          order: 2,
          content: 'Placeholder content for service description will be added here later.',
        },
        {
          key: 'paymentTerms',
          order: 3,
          content: 'Placeholder content for payment terms will be added here later.',
        },
        {
          key: 'cancellationPolicy',
          order: 4,
          content: 'Placeholder content for cancellation policy will be added here later.',
        },
        {
          key: 'complaintHandling',
          order: 5,
          content: 'Placeholder content for complaint handling will be added here later.',
        },
        {
          key: 'copyrightNotice',
          order: 6,
          content: 'Placeholder content for copyright notice will be added here later.',
        },
        {
          key: 'cookieInformation',
          order: 7,
          content: 'Placeholder content for cookie information will be added here later.',
        },
      ],
    });
  }
}
