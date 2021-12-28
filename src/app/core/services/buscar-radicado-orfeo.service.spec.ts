import { TestBed } from '@angular/core/testing';

import { BuscarRadicadoOrfeoService } from './buscar-radicado-orfeo.service';

describe('BuscarRadicadoOrfeoService', () => {
  let service: BuscarRadicadoOrfeoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BuscarRadicadoOrfeoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
