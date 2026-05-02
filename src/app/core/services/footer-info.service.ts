import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { FooterProviderInfo } from '../../models/footer-provider-info.model';

@Injectable({ providedIn: 'root' })
export class FooterInfoService {
  getProviderInfo(): Observable<FooterProviderInfo> {
    // Future Spring Boot endpoint: GET /api/public/footer/provider-info
    return of({
      companyName: 'KBR Bt',
      registeredOffice: '1031. Budapest, Vizimolnár u. 2. 10/98',
      taxNumber: '21551422-1-41',
      serviceProviderPerson: 'Koncsag Réka',
      registrationNumber: 'B/2020/000101',
    });
  }
}
