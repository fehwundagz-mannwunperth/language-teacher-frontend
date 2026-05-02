import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { PricePackage } from '../../models/price-package.model';

@Injectable({ providedIn: 'root' })
export class PricingService {
  getPricePackages(): Observable<PricePackage[]> {
    // Future Spring Boot endpoint: GET /api/public/prices
    return of([
      {
        id: 1,
        title: 'Single Lesson',
        price: 9000,
        currency: 'HUF',
        description: 'A flexible one-off lesson for a specific topic or trial session.',
        features: ['60 minutes', 'Online or in person', 'Personal feedback'],
      },
      {
        id: 2,
        title: 'Monthly Pack',
        price: 34000,
        currency: 'HUF',
        description: 'Four lessons with a simple learning plan and weekly practice tasks.',
        features: ['4 x 60 minutes', 'Progress plan', 'Homework review'],
      },
      {
        id: 3,
        title: 'Intensive Pack',
        price: 64000,
        currency: 'HUF',
        description: 'Eight lessons for exam preparation or fast speaking improvement.',
        features: ['8 x 60 minutes', 'Priority scheduling', 'Extra materials'],
      },
    ]);
  }
}
