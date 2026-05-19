import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { PricePackage } from '../../models/price-package.model';

@Injectable({ providedIn: 'root' })
export class PricingService {
  public getPricePackages(): Observable<PricePackage[]> {
    // Future Spring Boot endpoint: GET /api/public/prices
    return of([
      {
        id: 1,
        title: 'Egy óra',
        price: 9000,
        currency: 'HUF',
        description: 'Rugalmas, egyszeri óra egy adott témához vagy próbafoglalkozáshoz.',
        features: ['60 perc', 'Online vagy személyesen', 'Személyes visszajelzés'],
      },
      {
        id: 2,
        title: 'Havi csomag',
        price: 34000,
        currency: 'HUF',
        description: 'Négy lecke egyszerű tanulási tervvel és heti gyakorlófeladatokkal.',
        features: ['4 x 60 perc', 'Haladási terv', 'Házi feladat áttekintése'],
      },
      {
        id: 3,
        title: 'Intenzív csomag',
        price: 64000,
        currency: 'HUF',
        description: 'Nyolc lecke a vizsgára való felkészüléshez vagy a gyors beszédfejlesztéshez.',
        features: ['8 x 60 perc', 'Elsőbbségi ütemezés', 'Extra anyagok'],
      },
    ]);
  }
}
