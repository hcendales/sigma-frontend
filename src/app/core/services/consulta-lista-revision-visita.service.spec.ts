import { TestBed } from '@angular/core/testing';

import { ConsultaListaRevisionVisitaService } from './consulta-lista-revision-visita.service';

describe('ConsultaListaRevisionVisitaService', () => {
  let service: ConsultaListaRevisionVisitaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConsultaListaRevisionVisitaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
