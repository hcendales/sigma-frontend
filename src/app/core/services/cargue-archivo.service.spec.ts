import { TestBed } from '@angular/core/testing';

import { CargueArchivoService } from './cargue-archivo.service';

describe('CargueArchivoService', () => {
  let service: CargueArchivoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CargueArchivoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
