import { TestBed } from '@angular/core/testing';

import { VincularRadicadoService } from './vincular-radicado.service';

describe('VincularRadicadoService', () => {
  let service: VincularRadicadoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VincularRadicadoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
