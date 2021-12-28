import { TestBed } from '@angular/core/testing';

import { EntityTabArchivoServiceService } from './entity-tab-archivo-service.service';

describe('EntityTabArchivoServiceService', () => {
  let service: EntityTabArchivoServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EntityTabArchivoServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
