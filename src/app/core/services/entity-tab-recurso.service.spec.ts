import { TestBed } from '@angular/core/testing';

import { EntityTabRecursoService } from './entity-tab-recurso.service';

describe('EntityTabRecursoService', () => {
  let service: EntityTabRecursoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EntityTabRecursoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
