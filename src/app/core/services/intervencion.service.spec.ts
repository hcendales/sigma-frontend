import { TestBed } from '@angular/core/testing';

import { IntervencionService } from './intervencion.service';

describe('IntervencionService', () => {
  let service: IntervencionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IntervencionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
