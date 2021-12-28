import { TestBed } from '@angular/core/testing';

import { ProgramacionDiariaCuadrillaService } from './programacion-diaria-cuadrilla.service';

describe('ProgramacionDiariaCuadrillaService', () => {
  let service: ProgramacionDiariaCuadrillaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProgramacionDiariaCuadrillaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
