import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerDetalleMantenimientoComponent } from './ver-detalle-mantenimiento.component';

describe('VerDetalleMantenimientoComponent', () => {
  let component: VerDetalleMantenimientoComponent;
  let fixture: ComponentFixture<VerDetalleMantenimientoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VerDetalleMantenimientoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VerDetalleMantenimientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
