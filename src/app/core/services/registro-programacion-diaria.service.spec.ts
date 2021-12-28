import { TestBed } from '@angular/core/testing';

import { RegistroProgramacionDiariaService } from './registro-programacion-diaria.service';

describe('RegistroProgramacionDiariaService', () => {
  let service: RegistroProgramacionDiariaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RegistroProgramacionDiariaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
