import { TestBed } from '@angular/core/testing';

import { CargarDocumentoService } from './cargar-documento.service';

describe('CargarDocumentoService', () => {
  let service: CargarDocumentoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CargarDocumentoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
