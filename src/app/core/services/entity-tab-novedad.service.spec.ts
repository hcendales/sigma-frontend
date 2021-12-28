import { TestBed } from '@angular/core/testing';

import { EntityTabNovedadService } from './entity-tab-novedad.service';

describe('EntityTabNovedadService', () => {
  let service: EntityTabNovedadService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EntityTabNovedadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
