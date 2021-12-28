import { TestBed } from '@angular/core/testing';

import { EntityTabAledanioService } from './entity-tab-aledanio.service';

describe('EntityTabAledanioService', () => {
  let service: EntityTabAledanioService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EntityTabAledanioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
