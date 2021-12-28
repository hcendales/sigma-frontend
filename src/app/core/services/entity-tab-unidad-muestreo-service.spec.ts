import { TestBed } from '@angular/core/testing';

import { EntityTabUnidadMuestreoService } from './entity-tab-unidad-muestreo-service';

describe('EntityTabUnidadMuestreoServiceService', () => {
  let service: EntityTabUnidadMuestreoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EntityTabUnidadMuestreoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
