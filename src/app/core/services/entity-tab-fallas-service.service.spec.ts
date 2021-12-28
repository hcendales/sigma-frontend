import { TestBed } from '@angular/core/testing';

import { EntityTabFallasServiceService } from './entity-tab-fallas-service.service';

describe('EntityTabFallasServiceService', () => {
  let service: EntityTabFallasServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EntityTabFallasServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
