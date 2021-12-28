import { TestBed } from '@angular/core/testing';

import { ConsultaListaBandejaPendienteService } from './consulta-lista-bandeja-pendiente.service';

describe('ConsultaListaBandejaPendienteService', () => {
  let service: ConsultaListaBandejaPendienteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConsultaListaBandejaPendienteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
