import { TestBed } from '@angular/core/testing';

import { EntityTabOtrosFactoresServiceService } from './entity-tab-otros-factores-service.service';

describe('EntityTabOtrosFactoresServiceService', () => {
  let service: EntityTabOtrosFactoresServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EntityTabOtrosFactoresServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
