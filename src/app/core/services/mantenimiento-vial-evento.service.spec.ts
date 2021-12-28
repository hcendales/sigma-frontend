import { TestBed } from '@angular/core/testing';

import { MantenimientoVialEventoService } from './mantenimiento-vial-evento.service';

describe('MantenimientoVialEventoService', () => {
  let service: MantenimientoVialEventoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MantenimientoVialEventoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
