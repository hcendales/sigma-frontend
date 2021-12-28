import { TestBed } from '@angular/core/testing';

import { EntityTabAforoService } from './entity-tab-aforo.service';

describe('EntityTabAforoService', () => {
  let service: EntityTabAforoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EntityTabAforoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
