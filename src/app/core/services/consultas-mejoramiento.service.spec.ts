import { TestBed } from '@angular/core/testing';

import { ConsultasMejoramientoService } from './consultas-mejoramiento.service';

describe('ConsultasMejoramientoService', () => {
  let service: ConsultasMejoramientoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConsultasMejoramientoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
