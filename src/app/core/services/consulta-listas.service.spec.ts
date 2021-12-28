import { TestBed } from '@angular/core/testing';

import { ConsultaListasService } from './consulta-listas.service';

describe('ConsultaListasService', () => {
  let service: ConsultaListasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConsultaListasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
