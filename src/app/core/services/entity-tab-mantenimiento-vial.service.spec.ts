import { TestBed } from '@angular/core/testing';

import { EntityTabMantenimientoVialService } from './entity-tab-mantenimiento-vial.service';

describe('EntityTabMantenimientoVialService', () => {
  let service: EntityTabMantenimientoVialService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EntityTabMantenimientoVialService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
