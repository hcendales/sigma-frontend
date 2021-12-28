import { TestBed } from '@angular/core/testing';

import { EntityTabPersonaService } from './entity-tab-persona.service';

describe('EntityTabPersonaService', () => {
  let service: EntityTabPersonaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EntityTabPersonaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
