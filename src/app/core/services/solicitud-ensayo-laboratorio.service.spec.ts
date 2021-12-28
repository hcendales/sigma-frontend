import { TestBed } from '@angular/core/testing';

import { SolicitudEnsayoLaboratorioService } from './solicitud-ensayo-laboratorio.service';

describe('SolicitudEnsayoLaboratorioService', () => {
  let service: SolicitudEnsayoLaboratorioService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SolicitudEnsayoLaboratorioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
