import { TestBed } from '@angular/core/testing';

import { EntityTabFranjaService } from './entity-tab-franja.service';

describe('EntityTabFranjaService', () => {
  let service: EntityTabFranjaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EntityTabFranjaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
