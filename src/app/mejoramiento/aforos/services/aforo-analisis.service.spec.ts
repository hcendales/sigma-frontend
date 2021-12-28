import { TestBed } from '@angular/core/testing';

import { AforoAnalisisService } from './aforo-analisis.service';

describe('AforoAnalisisService', () => {
  let service: AforoAnalisisService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AforoAnalisisService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
